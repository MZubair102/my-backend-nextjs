import { NextResponse } from "next/server";
import User from "@/models/User"; // Make sure this path is correct
import { OTPService } from "@/lib/otpService"; // your OTP helper
import { sendEmail } from "@/lib/sendemail";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
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
        { success: false, message: "User already  Verified" },
        { status: 404 }
      );
    }

    // Generate OTP
    const otp = await OTPService.generateOtp();
    const otpValidTill = await OTPService.generateOtpValidTill();

    // Save OTP in the user document
    user.otp = otp;
    user.otpValidTill = otpValidTill;
    await user.save();

    // Send OTP via email/SMS here (currently just logging)
    console.log(`OTP for ${email}: ${otp}`);
    await sendEmail({
      email,
      subject: "Your OTP Code",
      html: `
      <h2>Verify Your Account</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code will expire in <b>5 minutes</b>.</p>
    `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP generated",
      user,
    });
  } catch (error) {
    console.error("OTP Generation Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
