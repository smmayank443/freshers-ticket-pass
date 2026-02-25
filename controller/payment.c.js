import ticket from "../model/ticket.m.js";
import auth from "../model/auth.m.js";

function uniqueNumber(email) {
  const now = new Date();
  const numbers = email.match(/\d+/g);
  const rollNum = numbers ? numbers.join("") : "";
  const formattedDate = now.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
  const formattedTime = now.toTimeString().split(" ")[0].replace(/:/g, ""); // HHMMSS
  return `${rollNum}_${formattedDate}_${formattedTime}`;
}

export const checkout = async (req, res) => {
  try {
    const { category, email } = req.body;
    const amount = category === "senior" ? 1600 : 600;
    const transactionRef = uniqueNumber(email);
    const message = email;
    const paymentLink = `upi://pay?pa=${encodeURIComponent(
      process.env.UPI_ID
    )}&pn=${encodeURIComponent(process.env.UPI_NAME)}&am=${encodeURIComponent(
      amount
    )}&cu=INR&tr=${encodeURIComponent(transactionRef)}&tn=${encodeURIComponent(
      message
    )}`;

    const authData = await auth.findOne({ email });

    if (authData.paymentDone) {
      return res.status(400).json({
        success: false,
        message: "Payment already done",
      });
    }

    res.status(200).json({
      status: true,
      message: "Payment link generated successfully",
      paymentLink,
      transactionRef,
      amount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const paymentDone = async (req, res) => {
  try {
    const { transactionRef, utr, email, category, ticketPrice } = req.body;
    const ticketData = await ticket.findOne({ utr });
    const authData = await auth.findOne({ email });

    if (ticketData) {
      return res.status(400).json({
        success: false,
        message: "Transaction already exists",
      });
    }

    if (!authData) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    // changing payment status
    authData.paymentDone = true;
    await authData.save();

    const newTicket = new ticket({
      transactionRef,
      email,
      utr,
      category,
      ticketPrice,
      verified: false,
    });

    await newTicket.save();

    res.status(200).json({
      status: true,
      message:
        "Your payment is successful and once verified you will receive your ticket ID",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { utr, email } = req.body;

    // checking in database for admin
    const user = await auth.findOne({ email }); // checking if the user is admin
    if (!user.admin) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized access",
      });
    }
    const ticketData = await ticket.findOne({ utr });

    if (!ticketData) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    const authData = await auth.findOne({ email: ticketData.email });

    if (!authData) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Update ticket status
    ticketData.verified = true;
    const uniq = `${utr}_${uniqueNumber(ticketData.email)}`;
    const shortTicket = shortenTicket(uniq);

    ticketData.ticketId = shortTicket;
    await ticketData.save();

    // Update user's ticket status
    authData.paymentVerified = true;
    authData.ticketId = ticketData.ticketId;
    await authData.save();

    res.status(200).json({
      status: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

function shortenTicket(ticketId) {
  // Split the ticket ID into parts
  const [utr, rollnum, datetime] = ticketId.split("_");

  // Extract required parts
  const shortUtr = utr.slice(0, 4); // First 4 digits of UTR
  const shortRollnum = rollnum.slice(0, 5); // First 4 digits of roll number
  const shortDatetime = datetime.slice(-3); // Last 4 digits of date and time

  // Combine into a 12-character string
  return `${shortUtr}${shortRollnum}${shortDatetime}`;
}
