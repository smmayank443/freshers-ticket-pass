import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

export const validateEmail = (req, res, next) => {
  const emailRegex = /^btech[0-9]{5}\.[0-9]{2}@bitmesra\.ac\.in$/;
  const { email } = req.body;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid email format" });
  }
  next();
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.json({ status: false, message: "Token not found" });
    }
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.json({ status: false, message: "Invalid token" });
      }
      req.email = decoded.email;
      next();
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: false, message: "Internal Server error" });
  }
};
// Compare this snippet from backened/controller/auth.c.js:
