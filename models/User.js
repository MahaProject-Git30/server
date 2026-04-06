import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  trim: true,
  match: [/^\S+@\S+\.\S+$/, "Please use valid email"]
  },

  mobile: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
  },

  resetToken: String,
  resetTokenExpire: Date

}, { timestamps: true });

export default mongoose.model("User", userSchema);