const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getDoctors).post(requireRole('admin'), createDoctor);
router.route('/:id').get(getDoctor).put(requireRole('admin'), updateDoctor).delete(requireRole('admin'), deleteDoctor);

module.exports = router;
