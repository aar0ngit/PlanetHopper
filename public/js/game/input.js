import { jump, duck, stopDucking } from './physics.js';
import { state } from './state.js';

// bind all inputs
export function bindInputs(handlers) {
    const { onStart, onAbandon, onRetry, onUseItem } = handlers;

    // keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!state.isRunning && e.code === 'Space') {
            onStart();
            return;
        }
        if (e.code === 'Space' || e.code === 'ArrowUp') jump();
        if (e.code === 'ArrowDown') duck();

        // hotkeys for items
        if (['1', '2', '3', '4'].includes(e.key)) {
            onUseItem(parseInt(e.key) - 1);
        }
    });

    // tap/click to launch
    document.addEventListener('click', (e) => {
        if (!state.isRunning) {
            // ignore clicks on buttons to prevent accidental starts when trying to navigate
            if (e.target.closest('button') || e.target.closest('a')) return;
            onStart();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowDown') stopDucking();
    });

    // hud button listeners
    document.getElementById('jumpBtn').onclick = () => jump();
    document.getElementById('duckBtn').onmousedown = () => duck();
    document.getElementById('duckBtn').onmouseup = () => stopDucking();

    document.getElementById('toggleControlsBtn').onclick = () => {
        const controls = document.getElementById('mobileControls');
        controls.classList.toggle('d-none');
        controls.classList.toggle('d-flex');
    };

    document.getElementById('abandonBtn').onclick = () => {
        onAbandon();
    };

    // screen navigation
    const goBack = () => window.location.href = 'planets.html';
    if (document.getElementById('backToPlanetsBtn')) document.getElementById('backToPlanetsBtn').onclick = goBack;
    if (document.getElementById('gameOverBackBtn')) document.getElementById('gameOverBackBtn').onclick = goBack;

    if (document.getElementById('gameOverRetryBtn')) {
        document.getElementById('gameOverRetryBtn').onclick = onRetry;
    }
}
