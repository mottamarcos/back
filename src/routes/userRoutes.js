// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get("/getUser/:id", userController.getUserById)

// Endpoint de registro
router.post("/registerUser", userController.registerUser);

// Endpoint de atualização de usuário
router.put("/updateUser", userController.updateUser);

module.exports = router;