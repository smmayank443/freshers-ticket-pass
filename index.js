import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import morgan from "morgan";
import authRouter from "./routes/auth.r.js";
import paymentRouter from "./routes/paymentRoute.r.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(cookieParser());
// app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.static(join(__dirname, "dist")));

app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);
app.use("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const mongoURL = process.env.DB_URL;
async function main() {
  mongoose.connect(mongoURL);
  console.log("Connected to MongoDB");
}

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

main().catch((err) => console.log(err));
