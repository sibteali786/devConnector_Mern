const jwt = require("jwtToken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header("x-auth-token");

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token authorization denied" }); // Not Authorized measn by 401
  }

  // verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtToken")); // decodes the token
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not Valid" });
  }
};
