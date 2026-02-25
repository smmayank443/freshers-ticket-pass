import auth from "../model/auth.m.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { sendOtpFunc, resetPasswordFunc } from "../Email/email.js";
import otplib from "otplib";
configDotenv();

let otpStore = {}; // In-memory store for OTPs (for demo purposes)

// Ensure otplib is correctly configured
otplib.authenticator.options = {
  step: 30, // The time step used for generating the OTP (default is 30 seconds)
  window: 1, // The allowable window for OTP verification (default is 1)
  digits: 6,
  algorithm: "sha1", // The algorithm used for OTP generation (default is 'SHA-1')
};

export const generateOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const student = await auth.findOne({ email: email });
    if (student) {
      return res
        .status(409) //conflict
        .json({ status: false, message: "Student already registered" });
    }

    // Regular expression to extract the year
    const match = email.match(/btech\d+\.(\d{2})@bitmesra\.ac\.in/);
    let category;
    if (match) {
      const year = match[1]; // The captured group contains the year
      if (year == 23) {
        category = "senior";
      } else if (year == 24) {
        category = "junior";
      }
    } else if (year == 24) {
      category = "junior";
    }

    const secret = otplib.authenticator.generateSecret();
    const otp = otplib.authenticator.generate(secret);

    otpStore[email] = { otp, secret };
    sendOtpFunc(email, otp, res, category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const { secret } = otpStore[email];
    const isValid = otplib.authenticator.verify({ token: otp, secret });
    if (isValid) {
      res.status(200).json({ status: true, message: "OTP verified" });
    } else {
      res.status(403).json({ status: false, message: "Invalid OTP" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

export const login = async (req, res) => {
  const data = req.body;
  try {
    const student = await auth.findOne({ email: data.email });
    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Student not registered" });
    }

    const match = await bcryptjs.compare(data.password, student.password);
    if (!match) {
      return res
        .status(403)
        .json({ status: false, message: "Invalid password" });
    }

    const token = jwt.sign({ email: student.email }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
        sameSite: "None", // Allows cross-site cookies; use 'Strict' or 'Lax' if not needed
        maxAge: 24 * 60 * 60 * 1000,
        path: "/", // Cookie will be sent for all routes
      })
      .json({
        status: true,
        message: "Login successful",
        paymentDone: student.paymentDone,
        paymentVerified: student.paymentVerified,
        email: student.email,
        category: student.category,
        ticketId: student.ticketId,
        admin: student.admin,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

export const signup = async (req, res) => {
  const data = req.body;
  const email = data.email;
  // Regular expression to extract the year
  const match = email.match(/btech\d+\.(\d{2})@bitmesra\.ac\.in/);
  let category;
  if (match) {
    const year = match[1]; // The captured group contains the year
    if (year == 23) {
      category = "senior";
    } else if (year == 24) {
      category = "junior";
    }
  } else {
    category = "junior";
  }

  try {
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    const newStudent = new auth({
      name: data.name,
      email: data.email,
      category: category,
      password: hashedPassword,
      mobile: data.mobile,
      paymentDone: false,
      admin: false,
    });
    await newStudent.save();
    res.status(201).json({ status: true, message: "Student registered" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

export const verification = async (req, res) => {
  try {
    const student = await auth.findOne({ email: req.email });

    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Student not registered" });
    }

    res.status(200).json({
      status: true,
      message: "Verification successful",
      paymentDone: student.paymentDone,
      paymentVerified: student.paymentVerified,
      ticketId: student.ticketId,
      email: student.email,
      category: student.category,
      admin: student.admin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .status(200)
    .json({ status: true, message: "Logout successful" });
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const student = await auth.findOne({ email: email });
    if (!student) {
      return res
        .status(404)
        .json({ status: false, message: "Student not registered" });
    }
    const token = jwt.sign({ email: student.email }, process.env.JWT_KEY, {
      expiresIn: "5m",
    });
    resetPasswordFunc(email, token, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const data = req.body;
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const student = await auth.findOne({ email: decoded.email });
    if (!student) {
      return res
        .status(403)
        .json({ status: false, message: "User doesn't exist!" });
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    await auth.updateOne(
      { email: decoded.email },
      { $set: { password: hashedPassword } }
    );
    res.status(200).json({ status: true, message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Link not valid" });
  }
};
