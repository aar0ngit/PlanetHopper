import { state } from './state.js';

// main draw call
export function render() {
    const { elements, player, enemy, obstacles, distanceTraveled, groundY, isSlamming, background } = state;
    const { ctx, canvas } = elements;

    // resize canvas to match screen
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    // calculate game scale and position
    const scale = canvas.width / 1920;
    const logicalHeight = 1080 * scale;
    const offsetY = (canvas.height - logicalHeight) / 2;

    // clear the screen
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // apply scaling transform
    ctx.translate(0, offsetY);
    ctx.scale(scale, scale);

    // draw the ground
    ctx.fillStyle = 'rgba(26, 26, 26, 0.7)';
    ctx.fillRect(0, groundY, 1920, 5000);

    // draw ground border
    ctx.fillStyle = 'rgba(51, 51, 51, 0.8)';
    ctx.fillRect(0, groundY, 1920, 4);

    // draw player or skin
    if (player.skin && player.skin.complete && player.skin.naturalHeight !== 0) {
        ctx.drawImage(player.skin, player.x, player.y - player.height, player.width, player.height);
    } else {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y - player.height, player.width, player.height);
    }

    // draw player outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y - player.height, player.width, player.height);

    // draw the enemy behind player
    ctx.fillStyle = enemy.color;
    ctx.fillRect(player.x - enemy.distance, groundY - 70, 50, 70);

    // draw obstacles
    ctx.fillStyle = '#ffc107';
    for (let obs of obstacles) {
        const xPos = obs.position_x - distanceTraveled + 100;
        if (xPos > -50 && xPos < 2000) {
            const h = (obs.obstacle_type === 'high') ? 80 : 40;
            ctx.fillRect(xPos, groundY - h, 30, 40);
        }
    }
}


//AI (decalred)