import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/DB";
import { getAuthUser, unauthorized, forbidden } from "@/lib/auth";

/* ─── PATCH /api/admin/users/:id ─────────────── 
   Body: { action: "approve" } or { action: "revoke" }  */
export async function PATCH(req, { params }) {
  const user = await getAuthUser(req);
  if (!user) return unauthorized();
  if (!user.isAdmin()) return forbidden("Admin access required");

  const { action } = await req.json();
  if (!["approve", "revoke"].includes(action)) {
    return Response.json(
      { success: false, message: "Action must be approve or revoke" },
      { status: 400 }
    );
  }

  await connectDB();

  const target = await UserModel.findByIdAndUpdate(
    params.id,
    { role: action === "approve" ? "user" : "pending" },
    { new: true }
  );

  if (!target) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return Response.json({
    success: true,
    message: `User ${action}d successfully`,
    data: target,
  });
}