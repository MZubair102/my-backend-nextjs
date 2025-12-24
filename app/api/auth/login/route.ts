// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import {connectDB} from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "user Not found" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  if (!user.isVerified) {
    return NextResponse.json(
      { message: "Please verify your email" },
      { status: 401 }
    );
  }


  const token = generateToken({ id: user._id.toString() });

  const res = NextResponse.json({ success: true ,message: "Login successful",user,token});
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "strict",
  });

  return res;
}
