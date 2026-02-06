import { fetchCharacter, deleteCharacter, updateCharacter } from './query/api.js';

const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

// logout handler
document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// page elements
const elements = {
    preview: document.getElementById('playerPreview'),
    colorInput: document.getElementById('colorInput'),
    skinInput: document.getElementById('skinInput'),
    saveBtn: document.getElementById('saveBtn'),
    clearBtn: document.getElementById('clearSkinBtn'),
    msg: document.getElementById('statusMessage')
};

let currentServerSkin = null;

// update player preview
const renderPreview = function () {
    elements.preview.style.backgroundColor = elements.colorInput.value;

    if (elements.skinInput.files && elements.skinInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            elements.preview.style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(elements.skinInput.files[0]);
    } else if (currentServerSkin) {
        elements.preview.style.backgroundImage = `url('${currentServerSkin}')`;
    } else {
        elements.preview.style.backgroundImage = 'none';
    }
};

// event listeners
elements.colorInput.addEventListener('input', renderPreview);
elements.skinInput.addEventListener('change', renderPreview);

// clear/delete character
elements.clearBtn.addEventListener('click', function () {
    const callback = function (err, data) {
        if (err) {
            elements.msg.textContent = "Delete Failed";
            return;
        }
        elements.skinInput.value = '';
        elements.colorInput.value = '#0d6efd';
        currentServerSkin = null;
        renderPreview();
        elements.msg.textContent = "Customization Reset (Deleted)";
        setTimeout(function () { elements.msg.textContent = ''; }, 2000);
    };
    deleteCharacter(token, callback);
});

// load settings
const callback = function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    if (data.player_color) elements.colorInput.value = data.player_color;
    if (data.skin_image_url) currentServerSkin = data.skin_image_url;
    renderPreview();
};
fetchCharacter(token, callback);

// save settings
elements.saveBtn.addEventListener('click', function () {
    const formData = new FormData();
    formData.append('player_color', elements.colorInput.value);

    if (elements.skinInput.files.length > 0) {
        formData.append('skin_image', elements.skinInput.files[0]);
    }

    const callback = function (err, data) {
        if (err) {
            console.error("Full Upload Error:", err);
            elements.msg.textContent = "Error: " + err.message;
            return;
        }

        if (data.message) {
            elements.msg.textContent = "Suit Updated Successfully";
            setTimeout(function () { elements.msg.textContent = ''; }, 2000);
            if (data.skin_url) {
                elements.preview.style.backgroundImage = `url('${data.skin_url}')`;
            }
        } else {
            elements.msg.textContent = "Update Failed";
        }
    };
    updateCharacter(formData, token, callback);
});
