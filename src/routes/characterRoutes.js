const express = require('express');
const router = express.Router();
const controller = require('../controllers/characterController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');

router.get('/', jwtMiddleware.verifyToken, controller.getSettings);
router.put('/', jwtMiddleware.verifyToken, controller.handleSkinUpload, controller.updateSettings);
router.delete('/', jwtMiddleware.verifyToken, controller.deleteSettings);

module.exports = router;
