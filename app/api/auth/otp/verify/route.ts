import { NextResponse } from "next/server";
import User from "@/models/User"; // Make sure this path is correct
import { connectDB } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User already verified" },
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

    // OTP is valid — update user
    user.isVerified = true;
    user.otp = null;
    user.otpValidTill = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      user,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
