// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');

// PROTECTED ROUTES (JWT Required)

// get user's inventory
router.get('/:user_id',
    jwtMiddleware.verifyToken,
    controller.getUserInventory
);

// use a consumable item
router.post('/use',
    jwtMiddleware.verifyToken,
    controller.validateUseInput,
    controller.checkOwnership,
    controller.decreaseQuantity,
    controller.cleanupEmptyItems,
    controller.completeUse
);

module.exports = router;
