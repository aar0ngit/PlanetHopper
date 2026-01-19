// P2509361
// Aaron Tan
// DIT/FT/1B/08

const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventoryController');

router.post('/', controller.addItem);// endpoint to add a new item to a user's collection
router.get('/:user_id', controller.readInventory);// endpoint to fetch all items owned by a specific user

module.exports = router;