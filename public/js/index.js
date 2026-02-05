// redirect logged-in users to dashboard
const token = localStorage.getItem('token');
if (token) {
    window.location.href = 'dashboard.html';
}
