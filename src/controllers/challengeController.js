// P2509361
// Aaron Tan
// DIT/FT/1B/08

const model = require('../models/challengeModel');

// CHALLENGE CRUD

// create new challenge
module.exports.createChallenge = (req, res) => {
  const { title, description, category, points_value } = req.body;

  // input validation
  if (!title || !category || !points_value) {
    return res.status(400).json({ message: "Title, category, and points_value required" });
  }

  if (points_value < 10 || points_value > 500) {
    return res.status(400).json({ message: "Points must be between 10 and 500" });
  }

  const validCategories = ['Cardio', 'Strength', 'Mindfulness', 'Nutrition', 'Sleep'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  const data = {
    title,
    description,
    category,
    points_value,
    created_by: res.locals.userId
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error insertChallenge:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Challenge created successfully",
      challenge_id: results.insertId,
      ...data
    });
  };

  model.insertChallenge(data, callback);
};

// get all challenges
module.exports.getAllChallenges = (req, res) => {
  const callback = (error, results) => {
    if (error) {
      console.error("Error selectAllChallenges:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  };

  model.selectAllChallenges(callback);
};

// get challenges by category
module.exports.getChallengesByCategory = (req, res) => {
  const data = {
    category: req.params.category
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error selectChallengesByCategory:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  };

  model.selectChallengesByCategory(data, callback);
};

// get challenge by id
module.exports.getChallengeById = (req, res) => {
  const data = {
    challenge_id: req.params.id
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error selectChallengeById:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json(results[0]);
  };

  model.selectChallengeById(data, callback);
};

// get challenges created by user
module.exports.getMyChallenges = (req, res) => {
  const data = {
    user_id: res.locals.userId
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error selectChallengesByUser:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  };

  model.selectChallengesByUser(data, callback);
};

// delete challenge
module.exports.deleteChallenge = (req, res) => {
  const data = {
    challenge_id: req.params.id,
    created_by: res.locals.userId
  };

  const callback = (error, results) => {
    if (error) {
      console.error("Error deleteChallenge:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Challenge not found or unauthorized" });
    }

    res.status(200).json({ message: "Challenge deleted successfully" });
  };

  model.deleteChallenge(data, callback);
};

// search challenges
module.exports.searchChallenges = (req, res) => {
  const search = req.query.q;

  if (!search) {
    return res.status(400).json({ message: "Search query required" });
  }

  const data = { search };

  const callback = (error, results) => {
    if (error) {
      console.error("Error searchChallenges:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  };

  model.searchChallenges(data, callback);
};
