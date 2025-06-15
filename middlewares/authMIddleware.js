const verifyToken = require("./verifyToken");

const authMiddleware = (req, res, next) => {
  console.log("Auth middleware triggered");
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token);

  const decoded = verifyToken(token);
  if (!decoded.id) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  // SET req.user here so downstream middlewares can use it
  req.user = decoded;
  console.log("Token verified:", decoded);

  next();
};

module.exports = authMiddleware;
