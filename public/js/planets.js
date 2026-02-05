import { fetchPlanets as apiFetchPlanets } from './query/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // logout handler
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });

    const planetsContainer = document.getElementById('planetsContainer');
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const statsBox = document.getElementById('statsBox');
    const statsBackdrop = document.getElementById('statsBackdrop');
    const statsContent = document.getElementById('statsContent');
    const closeStatsBtn = document.getElementById('closeStats');
    const missionLaunchBtn = document.getElementById('missionLaunchBtn');

    // fetch planets
    {
        const callback = (err, planets) => {
            if (err) {
                showAlert('danger', 'Failed to load planets: ' + err.message);
                planetsContainer.innerHTML = '<p class="text-center text-danger">Error loading starchart.</p>';
                return;
            }
            renderPlanets(planets);
        };
        apiFetchPlanets(token, callback);
    }

    // draw planets on starchart
    function renderPlanets(planets) {
        planetsContainer.innerHTML = '';
        planets.forEach(planet => {
            const isUnlocked = planet.is_unlocked;
            const statusClass = isUnlocked ? '' : 'locked';

            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-2';
            col.innerHTML = `
                <div class="planet-card ${statusClass}" data-planet-id="${planet.planet_id}">
                    <div class="planet-img-container p-img-${planet.order_index}">
                        <!-- add planet image here -->
                    </div>
                    <h5 class="mt-3 fw-bold text-uppercase small letter-spacing-1">${planet.name}</h5>
                </div>
            `;

            if (isUnlocked) {
                const callback = () => showPlanetStats(planet);
                col.querySelector('.planet-card').addEventListener('click', callback);
            } else {
                const callback = () => showAlert('warning', 'Mission Locked. Complete previous missions to decrypt this sector.');
                col.querySelector('.planet-card').addEventListener('click', callback);
            }

            planetsContainer.appendChild(col);
        });
    }

    // open mission briefing
    function showPlanetStats(planet) {
        statsContent.innerHTML = `
            <div class="text-center mb-4">
                <h2 class="display-6 fw-bold text-accent">${planet.name}</h2>
                <div class="badge bg-primary px-3 py-2">Sector ${planet.order_index}</div>
            </div>
            <p class="text-muted text-center mb-4">${planet.description || 'Detailed atmosphere analysis pending...'}</p>
            <div class="row g-3">
                <div class="col-6">
                    <div class="glass-card p-3 text-center">
                        <small class="text-muted d-block">Difficulty</small>
                        <span class="fw-bold">${getDifficulty(planet.order_index)}</span>
                    </div>
                </div>
                <div class="col-6">
                    <div class="glass-card p-3 text-center">
                        <small class="text-muted d-block">Duration</small>
                        <span class="fw-bold">${planet.duration_seconds}s</span>
                    </div>
                </div>
                <div class="col-12">
                    <div class="glass-card p-3 text-center">
                        <small class="text-muted d-block">Atmospheric Drag (Speed)</small>
                        <span class="fw-bold">${planet.speed} px/s</span>
                    </div>
                </div>
            </div>
        `;

        missionLaunchBtn.href = `loadout.html?planet=${planet.planet_id}`;

        // show overlay
        statsBox.style.display = 'block';
        statsBackdrop.style.display = 'flex';
    }

    // close mission briefing
    function hideStats() {
        statsBox.style.display = 'none';
        statsBackdrop.style.display = 'none';
    }

    closeStatsBtn.addEventListener('click', hideStats);

    // close on backdrop click
    {
        const callback = (e) => {
            if (e.target === statsBackdrop) {
                hideStats();
            }
        };
        statsBackdrop.addEventListener('click', callback);
    }

    // map index to difficulty name
    function getDifficulty(order) {
        const levels = ['Novice', 'Ranger', 'Veteran', 'Elite', 'Legendary'];
        return levels[order - 1] || 'Unknown';
    }

    // display status message
    function showAlert(type, message) {
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
});
