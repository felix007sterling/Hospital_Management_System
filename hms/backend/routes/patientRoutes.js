const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile, getPatients, getPatient } = require('../controllers/patientController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect);

router.get('/me', requireRole('patient'), getMyProfile);
router.put('/me', requireRole('patient'), updateMyProfile);
router.get('/', requireRole('admin', 'doctor'), getPatients);
router.get('/:userId', requireRole('admin', 'doctor'), getPatient);

module.exports = router;
