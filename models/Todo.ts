import mongoose, { Schema, models } from "mongoose";

const TodoSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Todo || mongoose.model("Todo", TodoSchema);
