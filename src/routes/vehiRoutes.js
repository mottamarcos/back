const express = require('express');
const router = express.Router();
const vehiController = require('../controllers/vehiController')

// Endpoint de atualização de usuário
router.get("/getVehicles", vehiController.getVehicles);

module.exports = router;