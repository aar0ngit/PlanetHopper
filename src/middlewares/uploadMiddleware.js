const multer = require('multer');
const path = require('path');
const fileSystem = require('fs');

// P2509361
// Aaron Tan
// DIT/FT/1B/08

// ENSURE UPLOAD DIRECTORY EXISTS
const uploadDir = path.join(__dirname, '../../public/uploads/skins');
if (!fileSystem.existsSync(uploadDir)) {
    fileSystem.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destCallback = callback;
        destCallback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        // generate unique filename to prevent collisions
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filenameCallback = callback;
        filenameCallback(null, 'skin-' + uniqueSuffix + ext);
    }
});

// FILTER FILE TYPES
const fileFilter = (req, file, callback) => {
    // accept images only
    const filterCallback = callback;
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return filterCallback(new Error('Only image files are allowed!'), false);
    }
    filterCallback(null, true);
};

// CONFIGURE UPLOAD LIMITS
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB Limit
    fileFilter: fileFilter
});

module.exports = upload;
