const express = require('express');
const router = express.Router();
const { createInvoice, getMyInvoices, payInvoice, getAllInvoices } = require('../controllers/invoiceController');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect);

router.post('/', requireRole('doctor', 'admin'), createInvoice);
router.get('/mine', requireRole('patient'), getMyInvoices);
router.get('/', requireRole('admin'), getAllInvoices);
router.put('/:id/pay', payInvoice);

module.exports = router;
