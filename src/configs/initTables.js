// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require("../services/db");

const SQLSTATEMENT = `
DROP TABLE IF EXISTS challenge_completions;
DROP TABLE IF EXISTS wellness_challenges;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wellness_challenges (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('Cardio', 'Strength', 'Mindfulness', 'Nutrition', 'Sleep') NOT NULL,
  points_value INT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_points (points_value)
);

CREATE TABLE challenge_completions (
  completion_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  challenge_id INT NOT NULL,
  points_earned INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES wellness_challenges(challenge_id) ON DELETE CASCADE,
  INDEX idx_user_completions (user_id, completed_at)
);

INSERT INTO users (username, email, password_hash, wellness_points, combat_points) VALUES
('spaceman1', 'spaceman1@example.com', '$2b$10$placeholder', 0),
('supermax1234', 'supermax1234@example.com', '$2b$10$placeholder', 0),
('maximumspace', 'maximumspace@example.com', '$2b$10$placeholder', 0);

INSERT INTO wellness_challenges (title, description, category, points_value, created_by) VALUES
('Sleep like a boss', 'Get 7+ hours of sleep', 'Sleep', 10, 1),
('Stairs over elevator? Respect.', 'Take the stairs today', 'Cardio', 20, 1),
('Digital detox (mini edition)', 'No phone for 1 hour', 'Mindfulness', 10, 2),
('Touch grass IRL', 'Take a 15-minute walk outside', 'Cardio', 10, 2),
('IRL > DMs', 'Talk to a friend face-to-face', 'Mindfulness', 20, 2),
('Declutter your chaos', 'Clean your desk or room', 'Mindfulness', 20, 3),
('Help a homie', 'Assist someone without being asked', 'Mindfulness', 20, 3);
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully!");
    console.log("3 seed users created");
    console.log("7 wellness challenges seeded");
  }
  process.exit();
});
