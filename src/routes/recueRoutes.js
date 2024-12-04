const express = require('express');
const router = express.Router();
const { createRescue } = require('../controllers/rescueController')

router.post('/createRescue', createRescue);

module.exports = router;