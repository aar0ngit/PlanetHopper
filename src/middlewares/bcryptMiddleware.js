const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.comparePassword = (req, res, next) => {
  // Check password
  const callback = (err, isMatch) => {
    if (err) {
      console.error("Error bcrypt:", err);
      res.status(500).json(err);
    } else {
      if (isMatch) {
        next();
      } else {
        res.status(401).json({
          message: "Wrong password",
        });
      }
    }
  };
  bcrypt.compare(req.body.password, res.locals.hash, callback);
};

module.exports.hashPassword = (req, res, next) => {
  if (!req.body.password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const callback = (err, hash) => {
    if (err) {
      console.error("Error bcrypt hash:", err);
      return res.status(500).json({ message: "Password processing error", error: String(err) });
    } else {
      res.locals.hash = hash;
      next();
    }
  };

  try {
    bcrypt.hash(req.body.password, saltRounds, callback);
  } catch (error) {
    console.error("Bcrypt Synchronous Error:", error);
    res.status(500).json({ message: "Password processing error", error: String(error) });
  }
};