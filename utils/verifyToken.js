const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    return jwt.verify(token, "anykey"); // returns decoded payload
  } catch (err) {
    return { msg: "invalid credentials" };
  }
};

module.exports = verifyToken;
