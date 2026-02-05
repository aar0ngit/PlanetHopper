import { fetchInventory as apiFetchInventory } from './query/api.js';

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

    // decode user id
    let userId;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId;
    } catch (e) {
        window.location.href = 'login.html';
        return;
    }

    const inventoryList = document.getElementById('inventoryList');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    // load inventory
    const callback = (err, items) => {
        if (err) {
            showAlert('danger', 'Bio-metric scan failed: ' + err.message);
            inventoryList.innerHTML = '<div class="col-12 text-center text-muted">Uplink lost.</div>';
            return;
        }
        renderInventory(items);
    };
    apiFetchInventory(userId, token, callback);

    // display items in grid
    function renderInventory(items) {
        inventoryList.innerHTML = '';

        if (items.length === 0) {
            inventoryList.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">Bay is empty. No mission assets detected.</p>
                    <a href="shop.html" class="btn btn-sm btn-outline-primary">Browse Black Market</a>
                </div>
            `;
            return;
        }

        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = `
                <div class="glass-card p-4 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="bg-secondary bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                            ${item.icon_class ?
                    `<i class="${item.icon_class}" style="font-size: 1.8rem; color: var(--accent);"></i>` :
                    `<i class="bi bi-box-fill" style="font-size: 1.8rem; color: var(--accent);"></i>`
                }
                        </div>
                        <div class="text-accent fw-bold fs-4">x${item.quantity}</div>
                    </div>
                    <h5 class="fw-bold mb-1">${item.name}</h5>
                    <p class="text-muted small mb-3">${item.description || 'Sealed asset.'}</p>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top border-light border-opacity-10">
                        <span class="badge bg-primary bg-opacity-10 text-primary small text-uppercase">${item.effect_type}</span>
                        <small class="text-muted italic">Ready for deploy</small>
                    </div>
                </div>
            `;
            inventoryList.appendChild(col);
        });
    }

    // display status message
    function showAlert(type, message) {
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${type} glass-card border-0 animate-fade" role="alert">
                ${message}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
});
