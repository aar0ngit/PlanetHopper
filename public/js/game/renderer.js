import { state } from './state.js';

// rounded rectangle path helper
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

// ground strip with a glowing edge
function drawGround(ctx, groundY, distanceTraveled) {
    const g = ctx.createLinearGradient(0, groundY, 0, groundY + 230);
    g.addColorStop(0, 'rgba(15, 12, 35, 0.85)');
    g.addColorStop(1, 'rgba(15, 12, 35, 0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, groundY, 1920, 5000);

    ctx.save();
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#a78bfa';
    ctx.fillRect(0, groundY - 2, 1920, 3);
    ctx.restore();

    // moving track marks give a sense of speed
    ctx.fillStyle = 'rgba(167, 139, 250, 0.25)';
    const gap = 120;
    const offset = distanceTraveled % gap;
    for (let x = -offset; x < 1920; x += gap) {
        ctx.fillRect(x, groundY + 14, 50, 3);
    }
}

// low obstacle: an amber crystal spike (matches the collision box in physics.js)
function drawSpike(ctx, x, groundY) {
    const top = groundY - 40;
    const g = ctx.createLinearGradient(0, top, 0, groundY);
    g.addColorStop(0, '#fde68a');
    g.addColorStop(1, '#f59e0b');
    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - 2, groundY);
    ctx.lineTo(x + 12, top);
    ctx.lineTo(x + 27, groundY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// high obstacle: a hovering drone you have to duck under
function drawDrone(ctx, x, groundY, t) {
    const cx = x + 12;
    const cy = groundY - 52 + Math.sin(t / 180 + x) * 2;
    ctx.save();
    ctx.shadowColor = 'rgba(244, 63, 94, 0.8)';
    ctx.shadowBlur = 16;
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// the player: rounded body with a visor, or the uploaded skin
function drawPlayer(ctx, player, t) {
    const x = player.x, y = player.y - player.height, w = player.width, h = player.height;

    // nitro trail
    if (state.nitroActive) {
        for (let i = 1; i <= 4; i++) {
            ctx.globalAlpha = 0.18 / i;
            ctx.fillStyle = '#38bdf8';
            roundRect(ctx, x - i * 16, y, w, h, 10);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    ctx.save();
    ctx.shadowColor = player.color;
    ctx.shadowBlur = 20;
    roundRect(ctx, x, y, w, h, 10);
    if (player.skin && player.skin.complete && player.skin.naturalHeight !== 0) {
        ctx.clip();
        ctx.drawImage(player.skin, x, y, w, h);
    } else {
        ctx.fillStyle = player.color;
        ctx.fill();
        // visor
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        roundRect(ctx, x + w * 0.45, y + Math.min(10, h * 0.2), w * 0.45, Math.min(12, h * 0.3), 5);
        ctx.fill();
    }
    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, w, h, 10);
    ctx.stroke();

    // shield bubble
    if (state.shieldActive) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.7 + Math.sin(t / 150) * 0.2;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, Math.max(w, h) * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

// the chaser behind the player
function drawEnemy(ctx, player, enemy, groundY, t) {
    const x = player.x - enemy.distance, y = groundY - 70;
    ctx.save();
    ctx.shadowColor = enemy.color;
    ctx.shadowBlur = 18 + Math.sin(t / 120) * 8;
    ctx.fillStyle = enemy.color;
    roundRect(ctx, x, y, 50, 70, 14);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 30, y + 18, 10, 6);
    ctx.restore();
}

// main draw call
export function render() {
    const { elements, player, enemy, obstacles, distanceTraveled, groundY } = state;
    const { ctx, canvas } = elements;
    const t = performance.now();

    // resize canvas to match screen
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    // scale a 1920x1080 world to the screen
    const scale = canvas.width / 1920;
    const logicalHeight = 1080 * scale;
    const offsetY = (canvas.height - logicalHeight) / 2;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0, offsetY);
    ctx.scale(scale, scale);

    drawGround(ctx, groundY, distanceTraveled);
    drawEnemy(ctx, player, enemy, groundY, t);

    for (let obs of obstacles) {
        const xPos = obs.position_x - distanceTraveled + 100;
        if (xPos > -50 && xPos < 2000) {
            if (obs.obstacle_type === 'high') drawDrone(ctx, xPos, groundY, t);
            else drawSpike(ctx, xPos, groundY);
        }
    }

    drawPlayer(ctx, player, t);
}
