const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getMyPrescriptions,
  getPatientPrescriptions
} = require('../controllers/prescriptionController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect);

router.post('/', requireRole('doctor'), createPrescription);
router.get('/mine', requireRole('patient'), getMyPrescriptions);
router.get('/patient/:patientId', requireRole('doctor', 'admin'), getPatientPrescriptions);

module.exports = router;
