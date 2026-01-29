// P2509361
// Aaron Tan
// DIT/FT/1B/08

const completionModel = require('../models/completionModel');
const userModel = require('../models/userModel');

//////////////////////////////////////
// MIDDLEWARE CHAIN FOR COMPLETING CHALLENGE
//////////////////////////////////////

//validate challenge exists
module.exports.validateChallengeExists = (req, res, next) => {
  const challenge_id = parseInt(req.params.id);

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkChallenge:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // Store challenge data for next middleware
    res.locals.challenge = results[0];
    res.locals.challenge_id = challenge_id;
    next();
  };

  completionModel.checkChallenge({ challenge_id }, callback);
};

// check if already completed
module.exports.checkAlreadyCompleted = (req, res, next) => {
  const user_id = res.locals.userId;
  const challenge_id = res.locals.challenge_id;

  const callback = (error, results) => {
    if (error) {
      console.error("Error checkExistingCompletion:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Challenge already completed" });
    }

    next();
  };

  completionModel.checkExistingCompletion({ user_id, challenge_id }, callback);
};

// insert completion record
module.exports.insertCompletionRecord = (req, res, next) => {
  const user_id = res.locals.userId;
  const challenge_id = res.locals.challenge_id;
  const points_earned = res.locals.challenge.points_value;

  const callback = (error, results) => {
    if (error) {
      console.error("Error insertCompletion:", error);
      return res.status(500).json({ message: "Database error" });
    }

    // store completion ID for response
    res.locals.completion_id = results.insertId;
    res.locals.points_earned = points_earned;
    next();
  };

  completionModel.insertCompletion({ user_id, challenge_id, points_earned }, callback);
};

// award wellness points to user
module.exports.awardWellnessPoints = (req, res, next) => {
  const user_id = res.locals.userId;
  const points = res.locals.points_earned;

  const callback = (error, results) => {
    if (error) {
      console.error("Error addWellnessPoints:", error);
      return res.status(500).json({ message: "Database error" });
    }

    next();
  };

  userModel.addWellnessPoints({ user_id, points }, callback);
};

// send success response
module.exports.sendCompletionResponse = (req, res) => {
  res.status(201).json({
    message: "Challenge completed successfully!",
    completion_id: res.locals.completion_id,
    points_earned: res.locals.points_earned,
    challenge_title: res.locals.challenge.title
  });
};

//////////////////////////////////////
// GET COMPLETIONS
//////////////////////////////////////

// get user's completion history (protected)
module.exports.getMyCompletions = (req, res) => {
  const data = {
    user_id: res.locals.userId
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error selectCompletionsByUser:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  };

  completionModel.selectCompletionsByUser(data, callback);
};

// get completions for a specific challenge (public)
module.exports.getCompletionsByChallenge = (req, res) => {
  const data = {
    challenge_id: req.params.challenge_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error selectCompletionsByChallenge:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  };

  completionModel.selectCompletionsByChallenge(data, callback);
};

// get completion count for challenge (public)
module.exports.getCompletionCount = (req, res) => {
  const data = {
    challenge_id: req.params.challenge_id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error getCompletionCount:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results[0]);
  };

  completionModel.getCompletionCount(data, callback);
};
