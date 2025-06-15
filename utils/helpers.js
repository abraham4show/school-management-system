const bcrypt = require("bcryptjs");
//hashed password

exports.passwordhashed = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

exports.isPassMatched = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
