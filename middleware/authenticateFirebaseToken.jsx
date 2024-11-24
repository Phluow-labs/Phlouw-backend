const admin = require("./firebase");

const authenticateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; 
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token", error: error.message });
  }
};

module.exports = authenticateFirebaseToken;
