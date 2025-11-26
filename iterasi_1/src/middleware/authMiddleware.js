import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid Authorization header",
        data: null,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
          data: null,
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      data: null,
    });
  }
}

function isPromoter(req, res, next) {
  if (!req.user || req.user.role !== "PROMOTER") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: access is restricted to promoters",
      data: null,
    });
  }
  next();
}

export { authenticateToken, isPromoter };