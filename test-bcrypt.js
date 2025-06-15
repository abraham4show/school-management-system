const bcrypt = require("bcryptjs");

(async () => {
  const password = "secret";
  const hash = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hash);

  const match = await bcrypt.compare("secret", hash);
  console.log("Password match result:", match); // should print: true
})();
