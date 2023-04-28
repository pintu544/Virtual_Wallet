const express = require('express');
const router =  express.Router();

const transactionController = require('../controllers/transactionController');

router.post('/send-money', transactionController.sendMoney);
router.post('/request-money', transactionController.requestMoney);
router.post('/accept-money-request', transactionController.acceptMoneyRequest);
router.post('/reject-money-request', transactionController.rejectMoneyRequest);


module.exports = router;