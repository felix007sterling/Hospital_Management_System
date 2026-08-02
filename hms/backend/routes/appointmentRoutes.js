const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateStatus,
  getAllAppointments
} = require('../controllers/appointmentController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect);

router.post('/', requireRole('patient'), bookAppointment);
router.get('/mine', requireRole('patient'), getMyAppointments);
router.get('/doctor', requireRole('doctor'), getDoctorAppointments);
router.get('/', requireRole('admin'), getAllAppointments);
router.put('/:id/status', updateStatus);

module.exports = router;
