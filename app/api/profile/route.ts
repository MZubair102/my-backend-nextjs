// app/api/profile/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import {connectDB} from "@/lib/db";

export async function GET(req: Request) {
  await connectDB();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId).select("-password"); // exclude password
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true,message: "User found",user});
}