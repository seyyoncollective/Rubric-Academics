import { createServerFn } from "@tanstack/react-start";
import { syncAttendanceSheet } from "@/lib/google-sheets.server";

/**
 * POST /api/sync-attendance-sheet
 *
 * Reads all attendance records from Supabase, aggregates per-student totals,
 * and writes them to the configured Google Sheet.
 *
 * Called from the faculty page after every successful "Save Attendance".
 * Non-blocking — attendance is already saved in Supabase before this runs.
 */
export const syncAttendanceSheetFn = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      return await syncAttendanceSheet();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error during Google Sheets sync";
      console.error("[SYNC_SHEET] Sync failed:", message, error);
      return { success: false, error: message, rowCount: 0, sheetName: "" };
    }
  });
