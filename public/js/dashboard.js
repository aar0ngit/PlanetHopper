import { fetchUserPoints, fetchUserProfile } from './query/api.js';

// logout handler
document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// check authentication
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
} else {
    // fetch and display user data
    {
        const callback = function (err, user) {
            if (!err && user.username) {
                document.getElementById('commanderName').textContent = user.username;
            }
        };
        fetchUserProfile(token, callback);
    }

    {
        const callback = function (err, points) {
            if (!err) document.getElementById('pointsDisplay').textContent = points;
        };
        fetchUserPoints(token, callback);
    }
}
