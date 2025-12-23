import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectDB();

  //  user id injected by middleware
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  //  Read query params
  const { searchParams } = new URL(req.url);
  const todoId = searchParams.get("id");

  //  Case 1: if ID exists → return single todo
  if (todoId) {
    if (!mongoose.Types.ObjectId.isValid(todoId)) {
      return NextResponse.json(
        { success: false, message: "Invalid todo id" },
        { status: 400 }
      );
    }

    const todo = await Todo.findOne({
      _id: new mongoose.Types.ObjectId(todoId),
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("userId", "name email");

    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, todo });
  }

  // 🟢 Case 2: No ID → return all todos
//   const todos = await Todo.find({ userId })
//     .populate("userId", "name email")
//     .sort({ createdAt: -1 });

//   return NextResponse.json({
//     success: true,
//     todos,
//   });
}
