// Planet Hopper: "Play as guest" buttons
// Creates a throwaway account on the server and jumps straight to the planet map.
document.querySelectorAll('[data-guest]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const label = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Preparing your ship...';
        try {
            const res = await fetch('/api/users/guest', { method: 'POST' });
            if (!res.ok) throw new Error();
            const data = await res.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            window.location.href = 'planets.html';
        } catch (err) {
            btn.disabled = false;
            btn.textContent = label;
            alert('Could not start a guest session. Please try again.');
        }
    });
});
