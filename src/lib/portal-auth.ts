// Simple shared-password gate for internal portals (per project spec).
// NOTE: This is intentionally lightweight; data security relies on the
// app being used by trusted internal staff only.
const ADMIN_KEY = "rb_admin_authed";
const FACULTY_KEY = "rb_faculty_authed";

export const ADMIN_PASSWORD = "ANJUM1984";
export const FACULTY_PASSWORD = "FACULTYRBAC";

const storage = () => (typeof window !== "undefined" ? window.sessionStorage : null);

export const isAdminAuthed = () => storage()?.getItem(ADMIN_KEY) === "1";
export const setAdminAuthed = (v: boolean) => v ? storage()?.setItem(ADMIN_KEY, "1") : storage()?.removeItem(ADMIN_KEY);

export const isFacultyAuthed = () => storage()?.getItem(FACULTY_KEY) === "1";
export const setFacultyAuthed = (v: boolean) => v ? storage()?.setItem(FACULTY_KEY, "1") : storage()?.removeItem(FACULTY_KEY);
