require("dotenv").config();
const jwt = require("jsonwebtoken");



const secretKey = process.env.JWT_SECRET_KEY;
const tokenDuration = process.env.JWT_EXPIRES_IN || "1h";
const tokenAlgorithm = process.env.JWT_ALGORITHM || "HS256";

// every level lasts 30 s; allow a little slack for frame timing
const MIN_RUN_SECONDS = 25;

module.exports.generateToken = (req, res, next) => {
  const payload = {
    userId: res.locals.userId,
    timestamp: new Date()
  };

  const options = {
    algorithm: tokenAlgorithm,
    expiresIn: tokenDuration,
  };

  const callback = (err, token) => {
    if (err) {
      console.error("Error jwt:", err);
      res.status(500).json(err);
    } else {
      res.locals.token = token;
      next();
    }
  };

  const token = jwt.sign(payload, secretKey, options, callback);
};

module.exports.generateRefreshToken = (req, res, next) => {
  const payload = {
    userId: res.locals.userId,
    timestamp: new Date()
  };

  const options = {
    algorithm: tokenAlgorithm,
    expiresIn: "7d", // Longer duration for refresh token
  };

  const callback = (err, token) => {
    if (err) {
      console.error("Error jwt refresh:", err);
      res.status(500).json(err);
    } else {
      res.locals.refreshToken = token;
      next();
    }
  };

  const token = jwt.sign(payload, secretKey, options, callback);
};

module.exports.sendToken = (req, res, next) => {
  res.status(200).json({
    message: res.locals.message,
    token: res.locals.token,
    refreshToken: res.locals.refreshToken
  });
};

module.exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const callback = (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "JWT expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    res.locals.userId = decoded.userId;
    res.locals.tokenTimestamp = decoded.timestamp;
    req.userId = decoded.userId; // Make accessible to Multer

    next();
  };

  jwt.verify(token, secretKey, callback);
};

module.exports.verifyGameToken = (req, res, next) => {
  const { game_token, planet_id, time_elapsed } = req.body;

  if (!game_token) {
    return res.status(403).json({ message: "Missing game session token" });
  }

  const callback = (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired game token" });
    }

    // anticheat checks
    if (decoded.planet_id != planet_id) {
      return res.status(403).json({ message: "Invalid game token for this planet" });
    }

    // the token must belong to the logged-in player
    if (decoded.user_id !== undefined && decoded.user_id !== res.locals.userId) {
      return res.status(403).json({ message: "Game token belongs to another player" });
    }

    // measure the run on the server, so editing time_elapsed in the browser does nothing
    const serverElapsedSeconds = (Date.now() - decoded.start_time) / 1000;
    if (serverElapsedSeconds < MIN_RUN_SECONDS || Number(time_elapsed) < MIN_RUN_SECONDS) {
      return res.status(403).json({ message: "Run finished too quickly (Anti-Cheat)" });
    }
    // the client cannot claim a run longer than really passed (2 s grace for network delay)
    if (Number(time_elapsed) > serverElapsedSeconds + 2) {
      return res.status(403).json({ message: "Reported time does not match the server (Anti-Cheat)" });
    }

    next();
  };
  jwt.verify(game_token, secretKey, callback);
};

module.exports.verifyRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  const callback = (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    res.locals.userId = decoded.userId;
    res.locals.message = "Token refreshed";
    next();
  };

  jwt.verify(refreshToken, secretKey, callback);
};