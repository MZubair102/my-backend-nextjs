import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out" });

  // Correct syntax: single object
  res.cookies.delete({
    name: "token",
    path: "/",
  });

  return res;
}
