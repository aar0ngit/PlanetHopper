import { fetchMethod } from './query/api.js';

// handle registration
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    if (registerForm) {
        // form submission
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showAlert('danger', 'Passwords do not match.');
                return;
            }

            const userData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: password
            };

            const callback = (error, data) => {
                if (error) {
                    showAlert('danger', error.message || 'Registration failed');
                } else {
                    showAlert('success', 'Enlistment complete! Redirecting to login...');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }
            };
            registerUser(userData, callback);
        });
    }

    // display status alert
    function showAlert(type, message) {
        if (!alertPlaceholder) return;
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${type} glass-card border-0 animate-fade" role="alert">
                ${message}
            </div>
        `;
    }

    // record new user
    function registerUser(data, callback) {
        const innerCallback = (status, ok, responseData) => {
            if (!ok) {
                callback({ message: responseData.message }, null);
            } else {
                callback(null, responseData);
            }
        };
        fetchMethod('/api/users/register', innerCallback, 'POST', data);
    }
});
