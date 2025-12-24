import mongoose, { Schema, models } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value), // wrap it
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: function (value: string) {
          // At least one uppercase letter and one special character
          return /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/.test(
            value
          );
        },
        message:
          "Password must contain at least 1 uppercase letter and 1 special character",
      },
    },
    isVerified: {
      type: Boolean,
      default: false, // user is not verified by default
    },

    otp: {
      type: Number,
    },

    otpValidTill: {
      type: Date,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", UserSchema);
export default User;
