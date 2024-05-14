const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/auth/vendoremployee/login', authController.login);
router.get('/vendoremployee/profile', authController.getProfile);
router.put('/vendoremployee/employee-reset-password', authController.employeeResetPassword);

module.exports = router;
