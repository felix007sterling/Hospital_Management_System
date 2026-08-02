const express = require('express');
const router = express.Router();
const { getAdminDashboard, getReports, getDoctorDashboard } = require('../controllers/dashboardController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/admin', protect, requireRole('admin'), getAdminDashboard);
router.get('/reports', protect, requireRole('admin'), getReports);
router.get('/doctor', protect, requireRole('doctor'), getDoctorDashboard);

module.exports = router;
