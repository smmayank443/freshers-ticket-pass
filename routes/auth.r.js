import express from "express";
import { validateEmail, verifyToken } from "../middleware/middleware.js";
import {
  login,
  signup,
  verifyOTP,
  verification,
  logout,
  forgetPassword,
  resetPassword,
  generateOTP,
} from "../controller/auth.c.js";

const router = express.Router();

router.post("/generate-otp", validateEmail, (req, res) => {
  generateOTP(req, res);
});

router.post("/verify-otp", validateEmail, (req, res) => {
  verifyOTP(req, res);
});

router.post("/login", validateEmail, (req, res) => {
  login(req, res);
});

router.post("/signup", validateEmail, (req, res) => {
  signup(req, res);
});

router.post("/resend-otp", validateEmail, (req, res) => {
  generateOTP(req, res);
});

router.post("/verify", verifyToken, (req, res) => {
  verification(req, res);
});

router.post("/logout", (req, res) => {
  logout(req, res);
});

router.post("/forget-password", validateEmail, (req, res) => {
  forgetPassword(req, res);
});

router.patch("/reset-password/:token", (req, res) => {
  resetPassword(req, res);
});

export default router;
