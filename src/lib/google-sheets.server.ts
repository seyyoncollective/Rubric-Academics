import { google } from "googleapis";
import { supabaseAdmin } from "@/integrations_supabase/client.server";
import * as path from "path";
import * as fs from "fs";

// ── Types ───────────────────────────────────────────────────────────────────
export type SyncResult = {
  success: boolean;
  rowCount: number;
  sheetName: string;
  /** Human-readable error message when success is false */
  error?: string;
};

// ── Config (read from env every call — avoids stale module-scope reads) ─────
function getConfig() {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME?.trim() || "Attendance Summary";

  if (!spreadsheetId) {
    throw new Error("Missing Google Sheets config: GOOGLE_SPREADSHEET_ID");
  }

  return { spreadsheetId, sheetName };
}

// ── Load Google service account credentials ──────────────────────────────────
// Tries env var first (Vercel), falls back to file on disk (local dev).
function loadCredentials(): { client_email: string; private_key: string } {
  const envJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (envJson) {
    try {
      return JSON.parse(envJson);
    } catch (e) {
      throw new Error(`Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON env var: ${e}`);
    }
  }

  // Fallback: read from file on disk (local development)
  const possiblePaths = [
    path.resolve(process.cwd(), "rubric-attendance-sync-3b680dc1eb57.json"),
  ];

  for (const filepath of possiblePaths) {
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, "utf-8");
      return JSON.parse(raw);
    }
  }

  throw new Error(
    "Google service account credentials not found. Set GOOGLE_SERVICE_ACCOUNT_JSON env var, or place the JSON file in the project root.",
  );
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
