// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require("../services/db");

const SQLSTATEMENT = `
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  points INT DEFAULT 0
);

CREATE TABLE WellnessChallenge (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL
);

CREATE TABLE UserCompletion (
  completion_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details TEXT
);

CREATE TABLE CosmicInventory (
  item_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  rarity VARCHAR(50) DEFAULT 'Common',
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

INSERT INTO User (username, points) VALUES
('spaceman1', 0),
('supermax1234', 0),
('maximumspace', 0);

INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
(1, 'Sleep like a boss - Get 7+ hours of sleep', 10),
(1, 'Stairs over elevator? Respect. - Take the stairs today', 20),
(2, 'Digital detox (mini edition) - No phone for 1 hour', 10),
(2, 'Touch grass IRL - Take a 15-minute walk outside', 10),
(2, 'IRL > DMs Talk to a friend face-to-face', 20),
(3, 'Declutter your chaos - Clean your desk or room', 20),
(3, 'Help a homie - Assist someone without being asked', 20);
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
});