import { state } from './game/state.js';
import { updatePhysics } from './game/physics.js';
import { render } from './game/renderer.js';
import { bindInputs } from './game/input.js';
import {
    useItem,
    completeGame,
    startGame as apiStartGame
} from './query/api.js';

// initialization

function initGame(data, selectedLoadout, userToken, planetId) {
    // setup game data
    state.token = userToken;
    state.sessionId = null;
    state.planet = data.planetData;
    state.obstacles = data.obstacles;
    state.loadout = selectedLoadout;
    state.speed = data.planetData.speed || 300;
    state.gameToken = data.game_token; // anti-cheat token

    // set background
    if (data.planetData.background_image) {
        document.body.style.backgroundImage = `url('${data.planetData.background_image}')`;
    }

    // character custom styles
    if (data.character) {
        if (data.character.player_color) {
            state.player.color = data.character.player_color;
        }
        if (data.character.skin_image_url) {
            state.player.skin = new Image();
            state.player.skin.src = data.character.skin_image_url;
        }
    }

    // sound setup
    if (state.planet) {
        let musicFile = state.planet.music_file;

        // decide which music file to use
        if (!musicFile && state.planet.theme) {
            musicFile = `${state.planet.theme.toLowerCase()}.mp3`;
        }

        if (!musicFile && state.planet.name) {
            musicFile = `${state.planet.name.split(' ')[0].toLowerCase()}.mp3`;
        }

        if (!musicFile && state.planet.planet_id) {
            const idMap = {
                1: 'terra.mp3',
                2: 'magma.mp3',
                3: 'frost.mp3',
                4: 'cyber.mp3',
                5: 'void.mp3'
            };
            musicFile = idMap[state.planet.planet_id];
        }

        if (musicFile) {
            // load and play music
            const cleanFileName = musicFile.split('/').pop().split('\\').pop();

            console.log("Loading music:", cleanFileName);
            state.backgroundMusic = new Audio(`/music/${cleanFileName}`);
            state.backgroundMusic.loop = true;
            state.backgroundMusic.volume = 0.5;

            state.backgroundMusic.addEventListener('error', (e) => {
                console.error("Error loading audio:", e);
            });

        } else {
            console.warn("No music file resolved for planet", state.planet);
        }
    }


    // get page elements
    state.elements.canvas = document.getElementById('gameCanvas');
    state.elements.ctx = state.elements.canvas.getContext('2d');
    state.elements.timeDisplay = document.getElementById('timeDisplay');
    state.elements.dangerWarning = document.getElementById('dangerWarning');
    state.elements.startMessage = document.getElementById('startMessage');

    // setup controls
    bindInputs({
        onStart: startGameLoop,
        onAbandon: abandonMission,
        onRetry: retryMission,
        onUseItem: triggerConsumable
    });

    // setup item buttons
    state.loadout.forEach((itemId, index) => {
        const btn = document.getElementById(`consumable${index + 1}`);
        if (itemId) {
            btn.textContent = `Asset ${itemId}`;
            btn.disabled = false;
            const callback = () => triggerConsumable(index);
            btn.onclick = callback;
        } else {
            btn.textContent = "Empty";
        }
    });

    // draw first frame
    render();

    // handle window resize
    const callback = () => {
        if (!state.isRunning) render();
    };
    window.addEventListener('resize', callback);
}

// mission control actions

function startGameLoop() {
    if (state.isRunning) return;

    // start the music
    if (state.backgroundMusic) {
        state.backgroundMusic.play()
            .then(() => console.log("Audio playing successfully"))
            .catch(e => {
                console.error("Music play blocked:", e);
            });
    }

    // grant brief safety if resuming
    if (state.nitroPaused) {
        state.invincible = true;
        state.nitroPaused = false;
        setTimeout(() => {
            state.invincible = false;
        }, 1000);
    }

    state.isRunning = true;
    state.startTime = Date.now();
    state.lastFrameTime = Date.now();
    state.elements.startMessage.classList.add('d-none');
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if (state.isGameOver) return;
    if (!state.isRunning) return;

    const now = Date.now();
    const deltaTime = (now - state.lastFrameTime) / 1000;
    state.lastFrameTime = now;

    // run physics and render
    updatePhysics(
        deltaTime,
        handleObstacleHit,
        handleMissionComplete
    );
    render();

    requestAnimationFrame(gameLoop);
}

function triggerConsumable(slotIndex) {
    const btn = document.getElementById(`consumable${slotIndex + 1}`);
    if (!btn || btn.disabled) return;

    const itemId = state.loadout[slotIndex];

    // handle item effects
    if (itemId == 1) { // shield
        state.shieldActive = true;
        state.player.color = '#0dcaf0';
    } else if (itemId == 2) { // nitro
        state.nitroActive = true;
        state.speed *= 2;
        setTimeout(() => {
            state.nitroActive = false;
            state.speed /= 2;

            // pause game after nitro
            state.isRunning = false;
            state.nitroPaused = true;

            // show resume message
            const startMsg = state.elements.startMessage;
            startMsg.innerHTML = `
                <p class="display-6 fw-bold text-white mb-2">Nitrous Depleted</p>
                <p class="text-accent animate-pulse">Press [SPACE] to Resume</p>
            `;
            startMsg.classList.remove('d-none');

        }, 5000);
    }

    // sync with server
    const callback = (err) => {
        if (err) console.error("Asset usage sync failed:", err);
    };
    useItem(itemId, state.token, callback);

    // update button style
    btn.disabled = true;
    btn.textContent = "DEPLETED";
    state.loadout[slotIndex] = null;
}

function handleObstacleHit(obstacle) {
    if (state.nitroActive) return;
    if (state.invincible) return;
    if (state.shieldActive) {
        state.shieldActive = false;
        state.player.color = '#0d6efd';
        return;
    }

    state.hitsTaken++;

    // check if game over
    if (state.hitsTaken >= 2) {
        triggerGameOver();
        return;
    }

    // visual shake effect
    state.elements.canvas.style.transform = 'translate(5px, 5px)';
    setTimeout(() => state.elements.canvas.style.transform = 'none', 100);

    // update enemy position
    if (state.enemy) {
        state.enemy.distance = Math.max(0, 100 - (state.hitsTaken * 60));
    }
}

// handle mission successful
function handleMissionComplete() {
    state.isGameOver = true;
    const results = {
        planet_id: state.planet.planet_id,
        time_elapsed: Math.floor(state.timeElapsed),
        hits_taken: state.hitsTaken,
        total_frames: state.totalFrames,
        game_token: state.gameToken
    };


    const callback = (err, resData) => {
        if (err) return;

        if (state.backgroundMusic) {
            state.backgroundMusic.pause();
            state.backgroundMusic.currentTime = 0;
        }

        document.getElementById('victoryScreen').classList.remove('d-none');

        const points = resData.points_earned || 0;
        let htmlContent = `
            <div class="mb-4">
                <div class="text-uppercase small text-muted mb-2">Rewards Earned</div>
                <span class="badge bg-warning text-dark fs-2 px-4 py-2 border border-warning shadow-sm">
                    +${points} CREDITS
                </span>
            </div>
        `;

        if (resData.nextPlanetUnlocked) {
            htmlContent += `<p class="text-info fw-bold fs-5 animate-pulse">New Sector Unlocked!</p>`;
        } else if (resData.gameCompleted) {
            htmlContent += `<p class="text-success fw-bold fs-5 animate-pulse">Galaxy Conquered!</p>`;
        }

        document.getElementById('unlockMessage').innerHTML = htmlContent;
    };
    completeGame(results, state.token, callback);
}

// handle game over
function triggerGameOver() {
    state.isGameOver = true;
    if (state.backgroundMusic) {
        state.backgroundMusic.pause();
        state.backgroundMusic.currentTime = 0;
    }
    document.getElementById('gameOverScreen').classList.remove('d-none');
}

// reload missions with same settings
function retryMission() {
    const loadoutIds = state.loadout.map(id => id || 0).join(',');
    window.location.href = `game.html?planet=${state.planet.planet_id}&loadout=${loadoutIds}`;
}

// return to map
function abandonMission() {
    if (state.backgroundMusic) {
        state.backgroundMusic.pause();
    }
    window.location.href = 'planets.html';
}

// main mission bootloader
document.addEventListener('DOMContentLoaded', () => {
    const userToken = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);

    let planetId = urlParams.get('planet');

    if (!userToken || !planetId) {
        window.location.href = 'planets.html';
        return;
    }

    const loadoutStr = urlParams.get('loadout');
    const selectedLoadout = loadoutStr ? loadoutStr.split(',').map(id => (id === '0' || id === '') ? null : id) : [];

    // start missions
    const callback = (err, data) => {
        if (err || !data.planetData) {
            alert("Deep-space uplink failed");
            return;
        }
        initGame(data, selectedLoadout, userToken, planetId);
    };
    apiStartGame(planetId, userToken, callback);
});
