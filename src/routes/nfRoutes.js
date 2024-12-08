const express = require("express");
const { getNotifications, createNotification, markNotificationAsRead } = require("../controllers/nfController");

const router = express.Router();

router.get('/getNotifications/:id', getNotifications);
router.post('/createNf/', createNotification);
router.put('/read/:id', markNotificationAsRead);

module.exports = router;