const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);      // the package also needs to know the secret to varify the token
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();     // The execution will continue
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
