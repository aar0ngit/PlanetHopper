import {
    fetchUserPoints,
    fetchShopItems,
    purchaseItem
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
        window.location.href = 'login.html';
    });

    const pointsDisplay = document.getElementById('userPoints');
    const itemsContainer = document.getElementById('shopItemsContainer');
    const alertPlaceholder = document.getElementById('alertPlaceholder');

    // purchase modal elements
    const purchaseModal = new bootstrap.Modal(document.getElementById('purchaseModal'));
    const modalItemName = document.getElementById('buyingItemName');
    const modalItemDesc = document.getElementById('buyingItemDesc');
    const modalItemCost = document.getElementById('buyingItemCost');
    const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');

    let currentItemToBuy = null;

    // initial load
    refreshPoints();
    {
        const callback = (err, items) => {
            if (err) {
                showAlert('danger', 'Scanner malfunction: ' + err.message);
                itemsContainer.innerHTML = '<div class="col-12 text-center text-danger">Black Market connection lost.</div>';
                return;
            }
            renderItems(items);
        };
        fetchShopItems(callback);
    }

    // update user balance display
    function refreshPoints() {
        const callback = (err, points) => {
            if (!err) pointsDisplay.textContent = points;
        };
        fetchUserPoints(token, callback);
    }

    // handle purchase confirmation
    const confirmPurchase = () => {
        if (!currentItemToBuy) return;

        const callback = (err, result) => {
            purchaseModal.hide();
            if (err) {
                showAlert('danger', 'Transaction rejected: ' + err.message);
            } else {
                showAlert('success', `Acquisition complete: ${currentItemToBuy.name} secured.`);
                refreshPoints();
            }
        };
        purchaseItem(currentItemToBuy.id, token, callback);
    };

    confirmPurchaseBtn.addEventListener('click', confirmPurchase);

    // display shop items
    function renderItems(items) {
        itemsContainer.innerHTML = '';
        items.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.innerHTML = `
                <div class="glass-card p-4 h-100 text-center d-flex flex-column">
                    <div class="mb-3">
                        <div class="p-1 bg-primary bg-opacity-10 rounded-circle d-inline-block d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                             ${item.icon_class ?
                    `<i class="${item.icon_class}" style="font-size: 2.5rem; color: var(--accent);"></i>` :
                    `<i class="bi bi-box" style="font-size: 2.5rem; color: var(--accent);"></i>`
                }
                        </div>
                    </div>
                    <h4 class="fw-bold mb-2">${item.name}</h4>
                    <p class="text-muted small mb-4 flex-grow-1">${item.description || 'Classified equipment.'}</p>
                    <div class="mb-4">
                        <span class="fs-4 fw-bold text-accent">${item.cost}</span> <small class="text-muted">Credits</small>
                    </div>
                    <button class="btn btn-primary w-100 buy-btn" 
                        data-id="${item.item_id}" 
                        data-name="${item.name}" 
                        data-desc="${item.description}" 
                        data-cost="${item.cost}">
                        Acquire Item
                    </button>
                </div>
            `;
            itemsContainer.appendChild(col);
        });

        // add event listeners to new buttons
        document.querySelectorAll('.buy-btn').forEach(btn => {
            const callback = () => {
                currentItemToBuy = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    cost: btn.dataset.cost,
                    desc: btn.dataset.desc
                };
                modalItemName.textContent = currentItemToBuy.name;
                modalItemDesc.textContent = currentItemToBuy.desc;
                modalItemCost.textContent = currentItemToBuy.cost;
                purchaseModal.show();
            };
            btn.addEventListener('click', callback);
        });
    }

    // display status alert
    function showAlert(type, message) {
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${type} glass-card border-0 animate-fade" role="alert">
                ${message}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
});
