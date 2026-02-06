# Planet Hopper
### ST0503 Backend Web Development CA2
**Name:** Aaron Tan  
**Admin No:** P2509361  
**Class:** DIT/FT/1B/08  

---

## Overview

**Planet Hopper** combines challenges with digital rewards. In this application, users must complete challenges to earn **Credits**. These credits are used to buy power-ups and skins for the **Planet Hopper**, where players hop across different planets, dodge obstacles, and compete on leaderboards.

## Key Features

*   **Wellness Hub**: Create and complete community challenges to earn points.
*   **Planet Hopper Game**: An interactive browser-based game with physics, obstacles, and power-ups.
*   **Security**:
    *   **Secure Authentication**: Uses JWT (JSON Web Tokens) for login sessions.
    *   **Refresh Tokens**: Keeps users logged in securely without re-entering passwords.
    *   **Anti-Cheat**: Validates game runs on the server to prevent fake high scores.
*   **Economy**: A full Shop and Inventory system to purchase and equip items (Nitro Boosts, Shields).
*   **Customization**: Customize your character's color and unlock new skins.
*   **Leaderboards**: Compete for the fastest times on every planet.

## Technology Stack

*   **Frontend**: HTML, CSS, JavaScript.
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL.
*   **Security**: Bcrypt, JWT.

## Setup Instructions

Follow these steps to get the project running on your local machine.

### 1. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 2. Configure Environment 
Create a file named `.env` in the root directory and add your settings:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=bed_ca2_db

# Security Configuration
JWT_SECRET_KEY=supersecretkey123
JWT_EXPIRES_IN=1h
JWT_ALGORITHM=HS256
```

### 3. Initialize Database
Run this command to create the database, tables, and seed initial data:
```bash
npm run init_tables
```

### 4. Start the Server
Start the backend server:
```bash
npm run dev
```
The server will run on `http://localhost:3000`.

## How to Play

1.  **Register/Login**: Create an account to start your journey.
2.  **Earn Credits**: Go to the **Challenges** tab and complete a challenge.
3.  **Gear Up**: Visit the **Shop** to buy a **Nitro Boost** or **Shield**.
4.  **Race**: Go to **Play Mission**, select a planet, equip your items in the Loadout screen, and launch!
5.  **Win**: Survive the run to unlock the next planet and climb the leaderboard.

## Project Structure

*   `public/`: Frontend files (HTML, CSS, JS, Images).
*   `src/config/`: Database setup scripts.
*   `src/controllers/`: Logic for handling requests.
*   `src/models/`: SQL queries and database interactions.
*   `src/routes/`: API route definitions.
*   `src/middlewares/`: Security checks (JWT, Bcrypt).

## Key API Endpoints

### Authentication & Users
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/users/register` | Register a new user account | No |
| `POST` | `/api/users/login` | Login and receive JWT & Refresh Token | No |
| `POST` | `/api/users/token/refresh` | Refresh an expired access token | No |
| `GET` | `/api/users/profile` | Get logged-in user's profile | Yes |
| `GET` | `/api/users/points` | Get logged-in user's current points | Yes |

### Challenges & Completions
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/challenges` | List all available challenges | No |
| `POST` | `/api/challenges` | Create a new community challenge | Yes |
| `GET` | `/api/challenges/:id` | Get details of a specific challenge | No |
| `POST` | `/api/completion/:id` | Mark a challenge as completed | Yes |
| `GET` | `/api/completion/me` | View your completion history | Yes |

### Game System
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/game/start` | Start a game session (Returns `game_token`) | Yes |
| `POST` | `/api/game/complete` | Complete a game session & record score | Yes |
| `GET` | `/api/planets` | List all planets and user progress | Yes |
| `GET` | `/api/planets/:id/leaderboard` | Get leaderboard for a specific planet | Yes |

### Shop & Inventory
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/shop/items` | List all items available in the shop | No |
| `POST` | `/api/shop/purchase` | Purchase an item with points | Yes |
| `GET` | `/api/inventory/:user_id` | View a user's inventory | Yes |
| `POST` | `/api/inventory/use` | Use a consumable item | Yes |

### Character Customization
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/character` | Get current character customization | Yes |
| `PUT` | `/api/character` | Update character skin/color | Yes |
