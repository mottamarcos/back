const express = require("express");
const router = express.Router(); // Corrigido para criar o router
const {login, resetPassword, sendRecoveryCode} = require("../controllers/authController"); // Importa o controller

router.post("/login", login);
router.post("/reset", resetPassword);
router.post("/recovery", sendRecoveryCode);


module.exports = router;