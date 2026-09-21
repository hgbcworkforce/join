import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  const xAccessToken = req.headers["x-access-token"];
  
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (xAccessToken) {
    token = xAccessToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is missing or unauthorized.",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "default-hgbc-firsttimer-jwt-secret-key-32chars";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};
