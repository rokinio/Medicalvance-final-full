import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  // --- خطوط دیباگ جدید ---
  console.log("\n--- PROTECT MIDDLEWARE INITIATED ---");
  console.log("Request Headers:", JSON.stringify(req.headers, null, 2));
  // --- پایان خطوط دیباگ ---

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (req.user) {
        console.log("Token verified successfully. User found:", req.user.email);
        next();
      } else {
        console.error("Token is valid, but user not found in DB.");
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
    } catch (error) {
      console.error("Token verification failed!", error.message);
      return res
        .status(401)
        .json({ message: "Not authorized, token is invalid" });
    }
  }

  if (!token) {
    console.error("No token found in headers.");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          message: `User role '${req.user.role}' is not authorized for this route`,
        });
    }
    next();
  };
};

export { protect, authorize };
