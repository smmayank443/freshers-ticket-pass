import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function resetPasswordFunc(email, token, res) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.G_USER,
      pass: process.env.G_PASS,
    },
  });

  const mailOptions = {
    from: process.env.G_USER,
    to: email,
    subject: "Password reset link from for freshers party",
    text: `Valid for 5 min. Do not share this link to anyone, Click on the link to reset your password ${process.env.URL}/resetPassword/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).json({
        status: false,
        message: "error sending mail! try again later",
      });
    } else {
      return res
        .status(200)
        .json({
          status: true,
          message: `A mail is sent to you college id: ${email}`,
        });
    }
  });
}

function sendOtpFunc(email, otp, res, category) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.G_USER,
      pass: process.env.G_PASS,
    },
  });

  const mailOptions = {
    from: process.env.G_USER,
    to: email,
    subject: "OTP for signup freshers party",
    text: `Do not share this OTP to anyone, valid for 5min. Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res
        .status(500)
        .json({ status: false, message: "error sending mail" });
    } else {
      return res.status(200).json({
        status: true,
        message: "Otp is sent to your Email",
        category: category,
      });
    }
  });
}

export { resetPasswordFunc, sendOtpFunc };
