import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

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

  // Create user
  const newUser = await User.create({ name, email, password: hash });

  // Return success message and user data (without password)
  return NextResponse.json({
    success: true,
    message: "User created successfully",
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
