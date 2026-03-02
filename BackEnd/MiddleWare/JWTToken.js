const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: false, message: "Unauthorized: No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwtkey);
    req.user = decoded;
    next();
  } catch (e) {
    console.log("JWT Error:", e.message);
    return res.status(401).json({ status: false, message: "Unauthorized: Invalid or expired token" });
  }
}

module.exports = authMiddleware;
