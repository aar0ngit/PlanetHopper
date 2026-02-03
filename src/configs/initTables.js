// P2509361
// Aaron Tan
// DIT/FT/1B/08

const pool = require("../services/db");

const SQLSTATEMENT = `


-- DROP TABLES IF THEY EXIST

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
    notes TEXT,
    completion_date DATE,
    points_earned INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES wellness_challenges(challenge_id) ON DELETE CASCADE,
    INDEX idx_user_completions (user_id, completed_at)
);

-- NEW TABLES

-- Shop Items
CREATE TABLE shop_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost INT NOT NULL,
    effect_type VARCHAR(50) NOT NULL,
    effect_duration INT,
    icon_class VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory
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

-- Planets
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

-- Planet Obstacles
CREATE TABLE planet_obstacles (
    obstacle_id INT AUTO_INCREMENT PRIMARY KEY,
    planet_id INT NOT NULL,
    obstacle_type ENUM('low', 'high') NOT NULL,
    position_x INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (planet_id) REFERENCES planets(planet_id) ON DELETE CASCADE,
    INDEX idx_planet_position (planet_id, position_x)
);

-- User Planet Progress
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

-- Seed Shop Items
INSERT INTO shop_items (name, description, cost, effect_type, effect_duration, icon_class) VALUES
('Shield', 'Absorbs 1 obstacle hit without penalty', 50, 'shield', NULL, 'bi-shield-fill-check'),
('Nitro Boost', 'Invulnerable auto-progress for 5 seconds', 75, 'nitro', 5, 'bi-lightning-charge-fill');

-- Seed Planets
INSERT INTO planets (name, theme, speed, duration_seconds, background_image, music_file, description, order_index) VALUES
('Terra', 'GreenBlue', 300, 30, '/images/planets/terra_bg.png', '/music/terra.mp3', 'The grassy starting planet - learn the basics', 1),
('Frost', 'IceWhite', 400, 30, '/images/planets/frost_bg.png', '/music/frost.mp3', 'Slippery ice terrain - speed increases', 2),
('Magma', 'RedOrange', 500, 30, '/images/planets/magma_bg.png', '/music/magma.mp3', 'Volcanic hazards - intense heat', 3),
('Cyber', 'NeonDark', 600, 30, '/images/planets/cyber_bg.png', '/music/cyber.mp3', 'Digital realm - glitchy obstacles', 4),
('Void', 'PurpleBlack', 1000, 30, '/images/planets/void_bg.png', '/music/void.mp3', 'The final challenge - survive the darkness', 5);

-- Planet progress will be tracked below
SELECT 1;
`;

// dynamic obstacle generator
const planets = [
    { id: 1, name: 'Terra', speed: 300, duration: 30 },
    { id: 2, name: 'Frost', speed: 400, duration: 30 },
    { id: 3, name: 'Magma', speed: 500, duration: 30 },
    { id: 4, name: 'Cyber', speed: 600, duration: 30 },
    { id: 5, name: 'Void', speed: 1000, duration: 30 }
];

let obstacleValues = [];
planets.forEach(p => {
    let currentX = 800;
    const maxDistance = p.speed * p.duration;
    const baseSpacing = 160;

    let lastType = null;
    let typeCount = 0;

    while (currentX < maxDistance - 1500) {
        let type;

        // prevent more than 2 of the same type in a row
        if (typeCount >= 2) {
            type = lastType === 'low' ? 'high' : 'low';
        } else {
            type = Math.random() > 0.5 ? 'low' : 'high';
        }

        if (type === lastType) {
            typeCount++;
        } else {
            lastType = type;
            typeCount = 1;
        }

        // random spacing between 160 and 230
        const spacing = Math.floor(Math.random() * (230 - 160 + 1)) + 160;
        obstacleValues.push(`(${p.id}, '${type}', ${currentX})`);
        currentX += spacing;
    }
});

const DYNAMIC_SQL = `
INSERT INTO planet_obstacles (planet_id, obstacle_type, position_x) VALUES
${obstacleValues.join(',\n')};

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

pool.query(SQLSTATEMENT, (error) => {
    if (error) return console.error("Schema/Seed Error:", error);

    pool.query(DYNAMIC_SQL, (err) => {
        if (err) return console.error("Dynamic Obstacle Error:", err);

        console.log("-----------------------------------------");
        console.log("Database Setup COMPLETE!");
        console.log(`Generated ${obstacleValues.length} obstacles (Varying 160-230px spacing).`);
        console.log("All Levels set to 30 Seconds.");
        console.log("-----------------------------------------");
        process.exit();
    });
});
