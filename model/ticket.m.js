import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  utr: {
    type: String,
    required: [true, "utr is required."],
  },

  transactionRef: {
    type: String,
    required: [true, "Transaction Reference is required."],
  },

  ticketId: {
    type: String,
    required: function () {
      return this.verified === true;
    },
    message: "Ticket ID is required when verified is true.",
  },

  email: {
    type: String,
    required: [true, "Email is required."],
  },

  category: {
    type: String,
    enum: ["senior", "junior"],
    required: [true, "Category is required."],
  },

  ticketPrice: {
    type: Number,
    required: [true, "Ticket Price is required."],
  },

  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
