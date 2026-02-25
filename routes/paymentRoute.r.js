import express from "express";
import {
  checkout,
  paymentDone,
  verifyPayment,
} from "../controller/payment.c.js";

const router = express.Router();

router.post("/checkout", async (req, res) => {
  checkout(req, res);
});

router.post("/payment", async (req, res) => {
  paymentDone(req, res);
});

router.post("/verify", async (req, res) => {
  verifyPayment(req, res);
});

export default router;
