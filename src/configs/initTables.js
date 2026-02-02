// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require("../services/db");

const SQLSTATEMENT = `


-- DROP TABLES IF THEY EXIST
DROP TABLE IF EXISTS game_sessions;
DROP TABLE IF EXISTS user_planet_progress;
DROP TABLE IF EXISTS planet_obstacles;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS planets;
DROP TABLE IF EXISTS shop_items;
DROP TABLE IF EXISTS challenge_completions;
DROP TABLE IF EXISTS wellness_challenges;
DROP TABLE IF EXISTS users;

-- EXISTING TABLES

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

-- NEW TABLES

-- Shop Items (Consumables for purchase)
CREATE TABLE shop_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost INT NOT NULL,
    effect_type VARCHAR(50) NOT NULL,
    effect_duration INT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory (User-owned consumables)
CREATE TABLE inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES shop_items(item_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_item (user_id, item_id)
);

-- Planets (5 Game Levels)
CREATE TABLE planets (
    planet_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    theme VARCHAR(50),
    speed INT NOT NULL,
    duration_seconds INT NOT NULL,
    background_image VARCHAR(255),
    music_file VARCHAR(255),
    description TEXT,
    order_index INT NOT NULL,
    UNIQUE KEY unique_order (order_index)
);

-- Planet Obstacles (Pre-set obstacle layouts)
CREATE TABLE planet_obstacles (
    obstacle_id INT AUTO_INCREMENT PRIMARY KEY,
    planet_id INT NOT NULL,
    obstacle_type ENUM('low', 'high') NOT NULL,
    position_x INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (planet_id) REFERENCES planets(planet_id) ON DELETE CASCADE,
    INDEX idx_planet_position (planet_id, position_x)
);

-- User Planet Progress (Unlock tracking)
CREATE TABLE user_planet_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    planet_id INT NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE,
    times_completed INT DEFAULT 0,
    best_time_seconds INT,
    last_played_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (planet_id) REFERENCES planets(planet_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_planet (user_id, planet_id)
);

-- Game Sessions (Anti-cheat validation)
CREATE TABLE game_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    planet_id INT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    result ENUM('win', 'loss', 'abandoned') NULL,
    hits_taken INT DEFAULT 0,
    time_elapsed_seconds INT,
    is_valid BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (planet_id) REFERENCES planets(planet_id) ON DELETE CASCADE,
    INDEX idx_user_sessions (user_id, start_time)
);

-- DATA

-- Users
INSERT INTO users (username, email, password_hash, points) VALUES
('spaceman1', 'spaceman1@example.com', '$2b$10$placeholder', 150),
('supermax1234', 'supermax1234@example.com', '$2b$10$placeholder', 200),
('maximumspace', 'maximumspace@example.com', '$2b$10$placeholder', 100);

-- Wellness Challenges
INSERT INTO wellness_challenges (title, description, category, points_value, created_by) VALUES
('Sleep like a boss', 'Get 7+ hours of sleep', 'Sleep', 10, 1),
('Stairs over elevator? Respect.', 'Take the stairs today', 'Cardio', 20, 1),
('Digital detox (mini edition)', 'No phone for 1 hour', 'Mindfulness', 10, 2),
('Touch grass IRL', 'Take a 15-minute walk outside', 'Cardio', 10, 2),
('IRL > DMs', 'Talk to a friend face-to-face', 'Mindfulness', 20, 2),
('Declutter your chaos', 'Clean your desk or room', 'Mindfulness', 20, 3),
('Help a homie', 'Assist someone without being asked', 'Mindfulness', 20, 3);

-- Seed Shop Items (3 Consumables)
INSERT INTO shop_items (name, description, cost, effect_type, effect_duration, image_url) VALUES
('Shield', 'Absorbs 1 obstacle hit without penalty', 50, 'shield', NULL, '/images/items/shield.png'),
('Nitro Boost', 'Invulnerable auto-progress for 5 seconds', 75, 'nitro', 5, '/images/items/nitro.png'),
('Repeller', 'Instantly pushes enemy back to safe distance', 100, 'repeller', NULL, '/images/items/repeller.png');

-- Seed Planets (5 Progressive Levels)
INSERT INTO planets (name, theme, speed, duration_seconds, background_image, music_file, description, order_index) VALUES
('Terra', 'GreenBlue', 300, 60, '/images/planets/terra_bg.png', '/music/terra.mp3', 'The grassy starting planet - learn the basics', 1),
('Frost', 'IceWhite', 400, 75, '/images/planets/frost_bg.png', '/music/frost.mp3', 'Slippery ice terrain - speed increases', 2),
('Magma', 'RedOrange', 500, 90, '/images/planets/magma_bg.png', '/music/magma.mp3', 'Volcanic hazards - intense heat', 3),
('Cyber', 'NeonDark', 600, 90, '/images/planets/cyber_bg.png', '/music/cyber.mp3', 'Digital realm - glitchy obstacles', 4),
('Void', 'PurpleBlack', 700, 120, '/images/planets/void_bg.png', '/music/void.mp3', 'The final challenge - survive the darkness', 5);

-- Seed Planet Obstacles (20-30 per planet, ~130 total)
-- Planet 1: Terra (Easy - 20 obstacles)
INSERT INTO planet_obstacles (planet_id, obstacle_type, position_x) VALUES
(1, 'low', 800), (1, 'low', 1400), (1, 'high', 2000), (1, 'low', 2600),
(1, 'high', 3200), (1, 'low', 3800), (1, 'low', 4400), (1, 'high', 5000),
(1, 'low', 5600), (1, 'high', 6200), (1, 'low', 6800), (1, 'low', 7400),
(1, 'high', 8000), (1, 'low', 8600), (1, 'high', 9200), (1, 'low', 9800),
(1, 'low', 10400), (1, 'high', 11000), (1, 'low', 11600), (1, 'high', 12200);

-- Planet 2: Frost (Medium - 25 obstacles)
INSERT INTO planet_obstacles (planet_id, obstacle_type, position_x) VALUES
(2, 'low', 700), (2, 'high', 1300), (2, 'low', 1800), (2, 'low', 2400),
(2, 'high', 3000), (2, 'low', 3500), (2, 'high', 4100), (2, 'low', 4700),
(2, 'low', 5200), (2, 'high', 5800), (2, 'low', 6300), (2, 'high', 6900),
(2, 'low', 7500), (2, 'low', 8000), (2, 'high', 8600), (2, 'low', 9200),
(2, 'high', 9700), (2, 'low', 10300), (2, 'low', 10900), (2, 'high', 11400),
(2, 'low', 12000), (2, 'high', 12600), (2, 'low', 13200), (2, 'low', 13800),
(2, 'high', 14400);

-- Planet 3: Magma (Hard - 28 obstacles)
INSERT INTO planet_obstacles (planet_id, obstacle_type, position_x) VALUES
(3, 'low', 600), (3, 'low', 1100), (3, 'high', 1600), (3, 'low', 2100),
(3, 'high', 2600), (3, 'low', 3100), (3, 'low', 3600), (3, 'high', 4100),
(3, 'low', 4600), (3, 'high', 5100), (3, 'low', 5600), (3, 'low', 6100),
(3, 'high', 6600), (3, 'low', 7100), (3, 'high', 7600), (3, 'low', 8100),
(3, 'low', 8600), (3, 'high', 9100), (3, 'low', 9600), (3, 'high', 10100),
(3, 'low', 10600), (3, 'low', 11100), (3, 'high', 11600), (3, 'low', 12100),
(3, 'high', 12600), (3, 'low', 13100), (3, 'high', 13600), (3, 'low', 14100);

-- Planet 4: Cyber (Very Hard - 30 obstacles)
INSERT INTO planet_obstacles (planet_id, obstacle_type, position_x) VALUES
(4, 'low', 500), (4, 'high', 950), (4, 'low', 1400), (4, 'low', 1850),
(4, 'high', 2300), (4, 'low', 2750), (4, 'high', 3200), (4, 'low', 3650),
(4, 'low', 4100), (4, 'high', 4550), (4, 'low', 5000), (4, 'high', 5450),
(4, 'low', 5900), (4, 'low', 6350), (4, 'high', 6800), (4, 'low', 7250),
(4, 'high', 7700), (4, 'low', 8150), (4, 'low', 8600), (4, 'high', 9050),
(4, 'low', 9500), (4, 'high', 9950), (4, 'low', 10400), (4, 'low', 10850),
(4, 'high', 11300), (4, 'low', 11750), (4, 'high', 12200), (4, 'low', 12650),
(4, 'high', 13100), (4, 'low', 13550);

-- Planet 5: Void (Extreme - 30 obstacles)
INSERT INTO planet_obstacles (planet_id, obstacle_type, position_x) VALUES
(5, 'low', 600), (5, 'high', 1100), (5, 'low', 1500), (5, 'low', 2000),
(5, 'high', 2500), (5, 'low', 2900), (5, 'high', 3400), (5, 'low', 3900),
(5, 'low', 4300), (5, 'high', 4800), (5, 'low', 5300), (5, 'high', 5700),
(5, 'low', 6200), (5, 'low', 6700), (5, 'high', 7100), (5, 'low', 7600),
(5, 'high', 8100), (5, 'low', 8500), (5, 'low', 9000), (5, 'high', 9500),
(5, 'low', 9900), (5, 'high', 10400), (5, 'low', 10900), (5, 'low', 11300),
(5, 'high', 11800), (5, 'low', 12300), (5, 'high', 12700), (5, 'low', 13200),
(5, 'high', 13700), (5, 'low', 14100);

-- Initialize Planet 1 as unlocked for all seed users
INSERT INTO user_planet_progress (user_id, planet_id, is_unlocked, times_completed, best_time_seconds) VALUES
(1, 1, TRUE, 0, NULL),
(2, 1, TRUE, 0, NULL),
(3, 1, TRUE, 0, NULL);

-- Initialize remaining planets as locked
INSERT INTO user_planet_progress (user_id, planet_id, is_unlocked) VALUES
(1, 2, FALSE), (1, 3, FALSE), (1, 4, FALSE), (1, 5, FALSE),
(2, 2, FALSE), (2, 3, FALSE), (2, 4, FALSE), (2, 5, FALSE),
(3, 2, FALSE), (3, 3, FALSE), (3, 4, FALSE), (3, 5, FALSE);

`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
    if (error) {
        console.error("Error creating tables:", error);
    } else {
        console.log("Tables created successfully!");
        console.log("3 seed users created");
        console.log("7 wellness challenges seeded");
        console.log("3 shop items created");
        console.log("5 planets created");
        console.log("133 obstacles seeded across all planets");
        console.log("Planet 1 unlocked for all users");
        console.log("Database Setup COMPLETE!");
    }
    process.exit();
});
