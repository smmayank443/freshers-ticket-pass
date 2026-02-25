import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  category: {
    type: String,
    required: [true, "Category is required."],
    enum: ["senior", "junior"],
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required."],
    match: [
      /^\d{10}$/,
      "Invalid mobile number format. Please use a valid 10-digit mobile number.",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    match: [
      /^btech\d{5}\.\d{2}@bitmesra\.ac\.in$/,
      "Invalid email format. Please use a valid BIT Mesra email (e.g., btechXXXXX.XX@bitmesra.ac.in).",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  paymentDone: {
    type: Boolean,
    default: false,
    required: true,
  },
  paymentVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
    required: true,
  },
  ticketId: {
    type: String,
    required: function () {
      return this.paymentVerified;
    },
    message: "Ticket ID is required when payment is verified.",
  },
});

const auth = mongoose.model("Auth", authSchema);
export default auth;
