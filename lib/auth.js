import jwt from "jsonwebtoken";
import { UserModel } from "@/models/DB";
import { connectDB } from "@/lib/mongodb";

/* ─── Pull the token out of the request header ── */
function getToken(req) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.split(" ")[1];
}

/* ─── Main auth function ─────────────────────── 
   Returns the user if valid, or null if not.
   You call this at the top of any API route
   that needs a logged-in user.                  */
export async function getAuthUser(req) {
  try {
    const token = getToken(req);
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const user = await UserModel.findById(decoded.id).select("+password");
    return user || null;
  } catch {
    return null;
  }
}

/* ─── Helper responses ───────────────────────── */
export function unauthorized(message = "Not authorised") {
  return Response.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = "Access denied") {
  return Response.json({ success: false, message }, { status: 403 });
}