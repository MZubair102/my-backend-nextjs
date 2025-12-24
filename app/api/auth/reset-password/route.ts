import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();

  const { email, otp,newPassword } = await req.json();

  if (!email || !otp || !newPassword) {
    return NextResponse.json(
      { success: false, message: "All fields required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User Not Found" },
      { status: 400 }
    );
  }
  if (user.otp !== Number(otp)) {
    return NextResponse.json(
      { success: false, message: "Invalid OTP" },
      { status: 400 }
    );
  }

  if (new Date() > new Date(user.otpValidTill)) {
    return NextResponse.json(
      { success: false, message: "OTP expired" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otp = null;
  user.otpValidTill = null;

  await user.save();

  return NextResponse.json({
    success: true,
    message: "Password reset successful",
  });
}
