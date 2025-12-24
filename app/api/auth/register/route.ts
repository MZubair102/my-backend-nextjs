import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { OTPService } from "@/lib/otpService"; // your OTP helper
import { sendEmail } from "@/lib/sendemail";

export async function POST(req: Request) {
  await connectDB();

  const { name, email, password } = await req.json();

  // Check required fields
  if (!name || !email || !password) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "User already exists" },
      { status: 400 }
    );
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Generate OTP
      const otp = await OTPService.generateOtp();
      const otpValidTill = await OTPService.generateOtpValidTill();
  
      // // Save OTP in the user document
      // user.otp = otp;
      // user.otpValidTill = otpValidTill;
      // await user.save();

  // Create user
  const newUser = await User.create({ name, email, password: hash, otp, otpValidTill});


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



  // Return success message and user data (without password)
  return NextResponse.json({
    success: true,
    message: "User created successfully and OTP sent",
    newUser
    // user: {
    //   id: newUser._id,
    //   name: newUser.name,
    //   email: newUser.email,
    // },
  });
}


export async function GET() {
  await connectDB();

  // Fetch all users but exclude password
  const users = await User.find({}, { password: 0 });

  return NextResponse.json({
    message: "Users fetched successfully",
    success: true,
    users,
  });
}
