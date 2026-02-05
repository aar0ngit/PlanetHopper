import { fetchPlanets as apiFetchPlanets, fetchPlanetLeaderboard } from './query/api.js';

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
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const leaderboardList = document.getElementById('leaderboardList');
    const leaderboardModal = new bootstrap.Modal(document.getElementById('leaderboardModal'));

    // fetch planets
    {
        const callback = (err, planets) => {
            if (err) {
                showAlert('danger', 'Failed to load planets: ' + err.message);
                planetsContainer.innerHTML = '<p class="text-center text-danger">Error loading Map.</p>';
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

        // Add "Coming Soon" placeholder
        const comingSoonCol = document.createElement('div');
        comingSoonCol.className = 'col-6 col-md-4 col-lg-2';
        comingSoonCol.innerHTML = `
            <div class="planet-card locked" style="cursor: default;">
                <div class="planet-img-container d-flex align-items-center justify-content-center bg-transparent shadow-none" 
                     style="border: 2px dashed rgba(255,255,255,0.2);">
                    <span class="fs-1 text-muted opacity-50">+</span>
                </div>
                <h5 class="mt-3 fw-bold text-uppercase small letter-spacing-1 text-muted">More Coming Soon</h5>
            </div>
        `;
        planetsContainer.appendChild(comingSoonCol);
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

        // attach leaderboard event
        leaderboardBtn.onclick = () => showLeaderboard(planet.planet_id, planet.name);

        // show overlay
        statsBox.style.display = 'block';
        statsBackdrop.style.display = 'flex';
    }

    // load and show leaderboard
    function showLeaderboard(planetId, planetName) {
        document.querySelector('#leaderboardModal .modal-title').textContent = `Top Runners - ${planetName}`;
        leaderboardList.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary"></div></div>';

        leaderboardModal.show();

        fetchPlanetLeaderboard(planetId, token, (err, data) => {
            if (err) {
                leaderboardList.innerHTML = `<div class="p-4 text-center text-danger">Failed to load payload: ${err.message}</div>`;
                return;
            }

            if (!data || data.length === 0) {
                leaderboardList.innerHTML = '<div class="p-4 text-center text-muted">No successful missions logged yet. Be the first!</div>';
                return;
            }

            let html = '';
            data.forEach((entry, index) => {
                const isFirst = index === 0;
                const badgeColor = isFirst ? 'text-warning' : (index === 1 ? 'text-secondary' : (index === 2 ? 'text-danger' : 'text-muted'));
                const icon = isFirst ? 'bi-trophy-fill' : 'bi-person-fill';

                html += `
                    <div class="list-group-item bg-transparent border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center px-4 py-3">
                        <div class="d-flex align-items-center">
                            <span class="fw-bold fs-5 me-3 ${badgeColor}">#${index + 1}</span>
                            <div>
                                <div class="fw-bold text-white">${entry.username}</div>
                                <small class="text-muted">${entry.times_completed} completions</small>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold text-accent font-monospace">${entry.best_time_seconds}s</div>
                        </div>
                    </div>
                `;
            });
            leaderboardList.innerHTML = html;
        });
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
