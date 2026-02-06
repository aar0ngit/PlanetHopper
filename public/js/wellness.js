import {
    fetchChallenges,
    createChallenge as apiCreateChallenge,
    deleteChallenge as apiDeleteChallenge,
    submitCompletion as apiSubmitCompletion,
    fetchCompletions as apiFetchCompletions
} from './query/api.js';

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
        window.location.href = 'index.html';
    });

    // decode user id
    let currentUserId;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserId = payload.userId;
    } catch (e) {
        window.location.href = 'login.html';
        return;
    }

    const challengesContainer = document.getElementById('challengesContainer');
    const logsContainer = document.getElementById('logsContainer');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    // modals
    const createModal = new bootstrap.Modal(document.getElementById('createChallengeModal'));
    const completeModal = new bootstrap.Modal(document.getElementById('completeChallengeModal'));
    const viewLogsModal = new bootstrap.Modal(document.getElementById('viewLogsModal'));

    // forms
    const createForm = document.getElementById('createChallengeForm');
    const completeForm = document.getElementById('completeChallengeForm');

    // state variables
    let selectedChallengeId = null;

    // fetch initial data
    refreshData();

    // reload challenges from server
    function refreshData() {
        const callback = (err, challenges) => {
            if (err) {
                showAlert('danger', 'Uplink failed: ' + err.message);
                return;
            }
            renderChallenges(challenges);
        };
        fetchChallenges(callback);
    }

    // display challenges in grid
    function renderChallenges(challenges) {
        challengesContainer.innerHTML = '';
        if (challenges.length === 0) {
            challengesContainer.innerHTML = '<div class="col-12 text-center py-5 text-muted">No community challenges found.</div>';
            return;
        }

        challenges.forEach(challenge => {
            const isCreator = (challenge.created_by == currentUserId);

            const col = document.createElement('div');
            col.className = 'col-md-6 col-xl-4';
            col.innerHTML = `
                <div class="glass-card p-4 h-100 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div class="text-accent fw-bold fs-5">+${challenge.points_value} <small class="text-muted fw-normal fs-6">Credits</small></div>
                    </div>
                    <h4 class="fw-bold mb-2">${challenge.title}</h4>
                    <p class="text-muted small mb-4 flex-grow-1">${challenge.description || 'No mission summary provided.'}</p>
                    
                    <div class="d-flex flex-column gap-2 mt-auto">
                        ${isCreator ?
                    `<button class="btn btn-outline-danger w-100 delete-btn" data-id="${challenge.challenge_id}">Retract Broadcast</button>` :
                    `<button class="btn btn-primary w-100 complete-btn" data-id="${challenge.challenge_id}" data-title="${challenge.title}">Accept Mission</button>`
                }
                        <button class="btn btn-outline-light btn-sm w-100 view-logs-btn" data-id="${challenge.challenge_id}">View Logs</button>
                    </div>
                </div>
            `;
            challengesContainer.appendChild(col);
        });

        // event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to retract this challenge broadcast?')) {
                    deleteChallenge(btn.dataset.id);
                }
            });
        });

        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedChallengeId = btn.dataset.id;
                document.getElementById('completeChallengeTitle').textContent = btn.dataset.title;
                completeModal.show();
            });
        });

        document.querySelectorAll('.view-logs-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                showLogs(btn.dataset.id);
            });
        });
    }

    // handlers
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(createForm);
        const data = Object.fromEntries(formData.entries());

        const callback = (err) => {
            if (err) {
                showAlert('danger', 'Transmission failed: ' + err.message);
            } else {
                showAlert('success', 'Challenge broadcasted successfully!');
                createModal.hide();
                createForm.reset();
                refreshData();
            }
        };
        apiCreateChallenge(data, token, callback);
    });

    completeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const notes = document.getElementById('completeNotes').value;
        const today = new Date().toISOString().split('T')[0];

        const callback = (err, resData) => {
            if (err) {
                console.log('Failed to log completion: ' + err.message);
            } else if (resData.points_earned) {
                showAlert('success', `Mission Complete! Received ${resData.points_earned} Galactic Credits.`);
                completeModal.hide();
                completeForm.reset();
                refreshData();
            } else {
                showAlert('warning', resData.message || 'Log rejected by Star Command.');
            }
        };
        apiSubmitCompletion(selectedChallengeId, { completion_date: today, notes }, token, callback);
    });

    // open mission logs modal
    function showLogs(challengeId) {
        logsContainer.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>';
        viewLogsModal.show();

        const callback = (err, logs) => {
            if (err) {
                logsContainer.innerHTML = `<div class="col-12 text-center text-danger">${err.message}</div>`;
                return;
            }

            if (logs.length === 0) {
                logsContainer.innerHTML = '<div class="col-12 text-center py-5 text-muted">No pilots have logged this mission yet.</div>';
                return;
            }

            logsContainer.innerHTML = '';
            logs.forEach(log => {
                const date = new Date(log.completion_date).toLocaleDateString();
                const col = document.createElement('div');
                col.className = 'col-md-6';
                col.innerHTML = `
                    <div class="glass-panel p-3 h-100">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="fw-bold text-accent">@${log.username}</span>
                            <small class="text-muted">${date}</small>
                        </div>
                        <p class="small mb-0 italic">"${log.notes || 'No notes provided.'}"</p>
                    </div>
                `;
                logsContainer.appendChild(col);
            });
        };
        apiFetchCompletions(challengeId, token, callback);
    }

    // remove a challenge broadcast
    function deleteChallenge(id) {
        const callback = (err) => {
            if (err) showAlert('danger', 'Retraction failed.');
            else {
                showAlert('success', 'Broadcast retracted.');
                refreshData();
            }
        };
        apiDeleteChallenge(id, token, callback);
    }

    // display status message
    function showAlert(type, message) {
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${type} alert-dismissible glass-card border-0 animate-fade" role="alert">
                ${message}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
});
