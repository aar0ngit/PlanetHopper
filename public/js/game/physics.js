import { state } from './state.js';

// jump logic
export function jump() {
    if (state.player.y >= state.groundY) {
        state.player.velocityY = -600;
    }
}

// duck logic
export function duck() {
    if (state.player.y < state.groundY) {
        state.player.velocityY = 1500;
        state.isSlamming = true;
    }
    if (state.player.state !== 'ducking') {
        state.player.state = 'ducking';
        state.player.height = 30;
    }
}

// restore height when duck ends
export function stopDucking() {
    if (state.player.state === 'ducking') {
        state.player.state = 'running';
        state.player.height = 60;
    }
}

// main physics update
export function updatePhysics(deltaTime, onHit, onComplete) {
    if (state.isGameOver) return;

    state.timeElapsed += deltaTime;
    state.totalFrames++;
    state.elements.timeDisplay.textContent = Math.floor(state.timeElapsed);

    const moveAmt = state.speed * deltaTime;
    state.distanceTraveled += moveAmt;

    // apply gravity
    state.player.velocityY += state.gravity * deltaTime;
    state.player.y += state.player.velocityY * deltaTime;

    // floor collision
    if (state.player.y >= state.groundY) {
        state.player.y = state.groundY;
        state.player.velocityY = 0;
        if (state.isSlamming) {
            state.isSlamming = false;
        }
    }

    // enemy move closer over time
    if (state.enemy.distance > 150) {
        state.enemy.distance -= 10 * deltaTime;
    }

    // danger warning ui
    state.elements.dangerWarning.style.display = (state.enemy.distance < 200) ? 'block' : 'none';

    // check for collisions
    const callback = (hitDetected, obstacle) => {
        if (hitDetected) onHit(obstacle);
    };
    checkCollisions(callback);

    // check if mission finished
    if (state.timeElapsed >= state.planet.duration_seconds) {
        onComplete();
    }
}

// collision detection logic  (Declared as AI)
function checkCollisions(callback) {
    const padding = 6;
    const { player, obstacles, distanceTraveled, groundY } = state;

    const pRect = {
        x: player.x + padding,
        y: player.y - player.height + padding,
        w: player.width - (padding * 2),
        h: player.height - (padding * 2)
    };

    for (let obs of obstacles) {
        const obsScreenX = obs.position_x - distanceTraveled + 100;
        if (obsScreenX > -50 && obsScreenX < 900) {
            const obsRect = {
                x: obsScreenX,
                y: obs.obstacle_type === 'high' ? groundY - 70 : groundY - 40,
                w: 25,
                h: 35
            };

            if (pRect.x < obsRect.x + obsRect.w &&
                pRect.x + pRect.w > obsRect.x &&
                pRect.y < obsRect.y + obsRect.h &&
                pRect.y + pRect.h > obsRect.y) {
                if (!obs.hit) {
                    obs.hit = true;
                    callback(true, obs);
                    return;
                }
            }
        }
    }
    callback(false, null);
}
