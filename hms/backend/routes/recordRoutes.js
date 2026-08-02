const express = require('express');
const router = express.Router();
const { createRecord, getMyRecords, getPatientRecords } = require('../controllers/recordController');
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/', requireRole('doctor'), upload.single('report'), createRecord);
router.get('/mine', requireRole('patient'), getMyRecords);
router.get('/patient/:patientId', requireRole('doctor', 'admin'), getPatientRecords);

module.exports = router;
