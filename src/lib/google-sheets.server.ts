import { google } from "googleapis";
import { supabaseAdmin } from "@/integrations_supabase/client.server";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

// ── Types ───────────────────────────────────────────────────────────────────
export type SyncResult = {
  success: boolean;
  rowCount: number;
  sheetName: string;
  /** Human-readable error message when success is false */
  error?: string;
};

// ── Locate service account JSON file ────────────────────────────────────────
function findServiceAccountPath(): string {
  // Try project root (dev server)
  const candidates = [
    path.resolve(process.cwd(), "rubric-attendance-sync-3b680dc1eb57.json"),
    // Try relative to this file in dev (src/lib -> ../.. -> project root)
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "rubric-attendance-sync-3b680dc1eb57.json"),
  ];

  for (const filepath of candidates) {
    if (fs.existsSync(filepath)) {
      return filepath;
    }
  }

  throw new Error(
    `Service account file not found. Tried:\n  ${candidates.join("\n  ")}`,
  );
}

function loadCredentials(): { client_email: string; private_key: string } {
  const raw = fs.readFileSync(findServiceAccountPath(), "utf-8");
  return JSON.parse(raw);
}

// ── Config (read from env every call — avoids stale module-scope reads) ─────
function getConfig() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME?.trim() || "Attendance Summary";

  if (!spreadsheetId) {
    throw new Error("Missing Google Sheets config: GOOGLE_SPREADSHEET_ID");
  }

  return { spreadsheetId, sheetName };
}

// ── Aggregate attendance records into per-student counts ────────────────────
type StudentAttendance = { name: string; present: number; absent: number };

async function aggregateAttendance(): Promise<StudentAttendance[]> {
  // Fetch all attendance records with the related student name via the FK
  const { data: records, error } = await supabaseAdmin
    .from("attendance_records")
    .select("student_id, status, students!inner(name)") as unknown as {
    data: { student_id: string; status: string; students: { name: string }[] }[] | null;
    error: any;
  };

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  if (!records || records.length === 0) {
    return [];
  }

  // Group by student_id
  const map = new Map<string, StudentAttendance>();

  for (const r of records) {
    const studentId = r.student_id;
    const studentName = (r.students as unknown as { name: string }).name;

    if (!map.has(studentId)) {
      map.set(studentId, { name: studentName, present: 0, absent: 0 });
    }

    const entry = map.get(studentId)!;
    if (r.status === "present") entry.present++;
    else entry.absent++;
  }

  // Sort alphabetically by name
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// ── Push aggregated data to Google Sheets ────────────────────────────────────
async function pushToSheets(
  spreadsheetId: string,
  sheetName: string,
  rows: StudentAttendance[],
): Promise<void> {
  const credentials = loadCredentials();

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Build the value grid: header row + data rows
  const values: (string | number)[][] = [["Student Name", "Days Present", "Days Absent"]];

  for (const row of rows) {
    values.push([row.name, row.present, row.absent]);
  }

  const range = `${sheetName}!A1:C${values.length}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

// ── Public entry point ───────────────────────────────────────────────────────
export async function syncAttendanceSheet(): Promise<SyncResult> {
  const { spreadsheetId, sheetName } = getConfig();

  // 1. Aggregate attendance from Supabase
  const rows = await aggregateAttendance();

  // 2. Push to Google Sheets (even if empty — clears the sheet)
  await pushToSheets(spreadsheetId, sheetName, rows);

  return {
    success: true,
    rowCount: rows.length,
    sheetName,
  };
}
