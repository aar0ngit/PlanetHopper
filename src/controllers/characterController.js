// P2509361
// Aaron Tan
// DIT/FT/1B/08

const characterModel = require('../models/characterModel');
const upload = require('../middlewares/uploadMiddleware');

// CHARACTER SETTINGS

// handle skin image upload
module.exports.handleSkinUpload = (req, res, next) => {
    const callback = (err) => {
        if (err) {
            console.error("Upload Error:", err);
            return res.status(400).json({ message: err.message });
        }
        next();
    };
    upload.single('skin_image')(req, res, callback);
};

// get user customization settings
module.exports.getSettings = (req, res, next) => {
    const user_id = res.locals.userId;

    const callback = (err, results) => {
        if (err) {
            console.error("Error getSettings:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            // return default if no settings exist
            return res.status(200).json({ player_color: '#0d6efd', skin_image_url: null });
        }
        res.status(200).json(results[0]);
    };

    characterModel.getSettings({ user_id }, callback);
};

// update user customization settings
module.exports.updateSettings = (req, res, next) => {
    const user_id = res.locals.userId;
    const { player_color } = req.body;
    let skin_image_url = req.body.skin_image_url;

    // use file path if uploaded
    if (req.file) {
        skin_image_url = '/uploads/skins/' + req.file.filename;
    }

    const data = {
        user_id,
        player_color,
        skin_image_url
    };

    const checkCallback = (err, results) => {
        if (err) {
            console.error("Error checking settings:", err);
            return res.status(500).json({ message: "Database error" });
        }

        const callback = (err, results) => {
            if (err) {
                console.error("Error updating/creating settings:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.status(200).json({
                message: "Settings updated successfully",
                skin_url: skin_image_url
            });
        };

        if (results.length > 0) {
            characterModel.updateSettings(data, callback);
        } else {
            characterModel.createSettings(data, callback);
        }
    };

    characterModel.checkSettingsExist(data, checkCallback);
};

// reset customization settings
module.exports.deleteSettings = (req, res, next) => {
    const user_id = res.locals.userId;

    const callback = (err, results) => {
        if (err) {
            console.error("Error deleteSettings:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(204).send();
    };

    characterModel.deleteSettings({ user_id }, callback);
};
