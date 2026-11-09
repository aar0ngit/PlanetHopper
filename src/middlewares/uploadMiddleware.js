// Planet Hopper: skin image upload
// Aaron Tan
//
// Files are kept in memory and saved to the database as a data URL, so uploads
// also work on serverless hosts (like Vercel) where the disk is read-only.

const multer = require('multer');

const MAX_BYTES = 300 * 1024; // 300 KB is plenty for a small character skin

// accept common image types only (checks the MIME type, not just the extension)
const fileFilter = (req, file, callback) => {
    if (!/^image\/(png|jpe?g|gif|webp)$/.test(file.mimetype)) {
        return callback(new Error('Only PNG, JPG, GIF or WebP images are allowed'), false);
    }
    callback(null, true);
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_BYTES },
    fileFilter: fileFilter
});

module.exports = upload;
