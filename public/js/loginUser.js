import { fetchMethod } from './query/api.js';

// handle login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    if (loginForm) {
        // form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            const callback = (error, data) => {
                if (error) {
                    showAlert('danger', error.message || 'Login failed');
                } else {
                    // store token
                    localStorage.setItem('token', data.token);
                    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

                    showAlert('success', 'Authentication successful! Initiating launch...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            };
            loginUser(userData, callback);
        });
    }

    // display status alert
    function showAlert(type, message) {
        if (!alertPlaceholder) return;
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} glass-card border-0 animate-fade`;
        alert.setAttribute('role', 'alert');
        alert.textContent = message;
        alertPlaceholder.replaceChildren(alert);
    }

    // authenticate user
    function loginUser(data, callback) {
        const innerCallback = (status, ok, responseData) => {
            if (!ok) {
                callback({ message: responseData.message }, null);
            } else {
                callback(null, responseData);
            }
        };
        fetchMethod('/api/users/login', innerCallback, 'POST', data);
    }
});
