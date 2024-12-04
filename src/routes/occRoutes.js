const express = require("express");
const { getOccurrencesOpened, createOccurrence, getOperationOcc, updateStatus, getOccAttended } = require("../controllers/occController");

const router = express.Router();

router.get('/find/:id', getOccurrencesOpened);
router.get('/findOp', getOperationOcc);
router.get('/getOccAttended', getOccAttended);
router.post('/', createOccurrence);
router.put('/status', updateStatus);


module.exports = router;