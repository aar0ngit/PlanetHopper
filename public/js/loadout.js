import { fetchInventory as apiFetchInventory, introspectToken } from './query/api.js';

// initialization
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // get planet id from url
    const urlParams = new URLSearchParams(window.location.search);
    const planetId = urlParams.get('planet');
    if (!planetId) {
        window.location.href = 'planets.html';
        return;
    }

    const inventoryContainer = document.getElementById('inventoryContainer');
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const startGameBtn = document.getElementById('startGameBtn');

    // loadout state
    let loadout = [null, null, null, null];
    let itemMap = {};

    // get user id and fetch inventory
    {
        const callback = function (err, data) {
            if (err) {
                window.location.href = 'login.html';
                return;
            }
            const innerCallback = function (err, items) {
                if (err) {
                    showAlert('danger', 'System scan failed: ' + err.message);
                    return;
                }
                renderInventory(items);
            };
            apiFetchInventory(data.userId, token, innerCallback);
        };
        introspectToken(token, callback);
    }

    // render inventory items
    function renderInventory(items) {
        inventoryContainer.innerHTML = '';
        if (items.length === 0) {
            inventoryContainer.innerHTML = `
                <div class="p-4 text-center w-100">
                    <p class="text-muted small">No assets available. <a href="shop.html" class="text-accent">Visit Shop</a></p>
                </div>
            `;
            return;
        }

        items.forEach(item => {
            if (item.quantity <= 0) return;
            itemMap[item.item_id] = item;

            const btn = document.createElement('div');
            btn.className = 'glass-card p-3 text-center mb-2 flex-grow-1 cursor-pointer';
            btn.style.minWidth = '120px';
            btn.innerHTML = `
                <div class="fw-bold small">${item.name}</div>
                <div class="text-accent small">x${item.quantity}</div>
            `;
            btn.onclick = () => equipItem(item.item_id);
            inventoryContainer.appendChild(btn);
        });
    }

    // equip an item to a slot
    function equipItem(itemId) {
        const emptySlotIndex = loadout.indexOf(null);
        if (emptySlotIndex === -1) {
            showAlert('warning', 'Loadout capacity reached. Remove an asset to free a slot.');
            return;
        }

        const ownedItem = itemMap[itemId];
        const countInLoadout = loadout.filter(id => id === itemId).length;
        if (countInLoadout >= ownedItem.quantity) {
            showAlert('warning', `Insufficient quantity of ${ownedItem.name}.`);
            return;
        }

        loadout[emptySlotIndex] = itemId;
        updateSlotUI(emptySlotIndex);
    }

    // remove an item from a slot
    function unequipItem(slotIndex) {
        loadout[slotIndex] = null;
        updateSlotUI(slotIndex);
    }

    // update the display for a slot
    function updateSlotUI(index) {
        const slotBtn = document.getElementById(`slot${index + 1}`);
        const itemId = loadout[index];

        if (itemId) {
            const item = itemMap[itemId];
            slotBtn.innerHTML = `Slot ${index + 1}: <span class="text-accent fw-bold ms-2">${item.name}</span>`;
            slotBtn.classList.remove('btn-outline-secondary');
            slotBtn.classList.add('btn-primary', 'bg-opacity-25');
            slotBtn.onclick = () => unequipItem(index);
        } else {
            slotBtn.innerHTML = `Slot ${index + 1}: <span class="text-muted ms-2">Empty</span>`;
            slotBtn.classList.remove('btn-primary', 'bg-opacity-25');
            slotBtn.classList.add('btn-outline-secondary');
            slotBtn.onclick = null;
        }
    }

    // start game handler
    const callback = () => {
        const loadoutIds = loadout.map(id => id || 0).join(',');
        window.location.href = `game.html?planet=${planetId}&loadout=${loadoutIds}`;
    };

    startGameBtn.addEventListener('click', callback);

    // display an alert message
    function showAlert(type, message) {
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${type} glass-card border-0 animate-fade" role="alert">
                ${message}
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
});
