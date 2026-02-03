// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/shopController');
const jwtMiddleware = require('../middlewares/jwtmiddleware');

// PUBLIC ROUTES

// get all shop items
router.get('/items', controller.getAllItems);

// get specific shop item
router.get('/items/:item_id', controller.getItemById);

// PROTECTED ROUTES (JWT Required)

// purchase item
router.post('/purchase',
    jwtMiddleware.verifyToken,
    controller.validatePurchaseInput,
    controller.validateItem,
    controller.checkPoints,
    controller.deductPoints,
    controller.addToInventory,
    controller.completePurchase
);

module.exports = router;
