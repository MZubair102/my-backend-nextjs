import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { OTPService } from "@/lib/otpService";
import { sendEmail } from "@/lib/sendemail";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const otp = await OTPService.generateOtp();
  const otpValidTill = await OTPService.generateOtpValidTill();

  user.otp = otp;
  user.otpValidTill = otpValidTill;
  await user.save();

  console.log(`OTP for ${email}: ${otp}`);
//   await sendEmail({
//     email,
//     subject: "Reset Your Password",
//     html: `
//       <h2>Password Reset</h2>
//       <p>Your OTP is:</p>
//       <h1>${otp}</h1>
//       <p>This OTP will expire in 5 minutes.</p>
//     `,
//   });

  return NextResponse.json({
    success: true,
    message: "Forgot Password OTP sent to email",
    otp,
  });
}
