const Invoice = require('../models/Invoice');
const DoctorProfile = require('../models/DoctorProfile');

const createInvoice = async (req, res) => {
  const { patient, appointment, medicineCharge, testCharge } = req.body;

  if (!patient) return res.status(400).json({ message: 'Patient is required' });

  const doctorProfile = await DoctorProfile.findOne({ user: req.user._id });
  const consultationCharge = doctorProfile ? doctorProfile.consultationFee : 0;
  const medCharge = Number(medicineCharge) || 0;
  const testCh = Number(testCharge) || 0;

  const invoice = await Invoice.create({
    patient,
    doctor: req.user._id,
    appointment: appointment || null,
    consultationCharge,
    medicineCharge: medCharge,
    testCharge: testCh,
    total: consultationCharge + medCharge + testCh
  });

  res.status(201).json(invoice);
};

const getMyInvoices = async (req, res) => {
  const invoices = await Invoice.find({ patient: req.user._id })
    .populate('doctor', 'name')
    .sort({ createdAt: -1 });
  res.json(invoices);
};

const payInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

  if (invoice.patient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  invoice.status = 'paid';
  await invoice.save();
  res.json(invoice);
};

const getAllInvoices = async (req, res) => {
  const invoices = await Invoice.find()
    .populate('patient', 'name')
    .populate('doctor', 'name')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(invoices);
};

module.exports = { createInvoice, getMyInvoices, payInvoice, getAllInvoices };
