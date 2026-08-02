const Prescription = require('../models/Prescription');

const createPrescription = async (req, res) => {
  const { patient, appointment, medicines, instructions } = req.body;

  if (!patient || !medicines || !medicines.length) {
    return res.status(400).json({ message: 'Patient and at least one medicine are required' });
  }

  const prescription = await Prescription.create({
    patient,
    doctor: req.user._id,
    appointment: appointment || null,
    medicines,
    instructions: instructions || ''
  });

  res.status(201).json(prescription);
};

const getMyPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.user._id })
    .populate('doctor', 'name')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
};

const getPatientPrescriptions = async (req, res) => {
  const prescriptions = await Prescription.find({ patient: req.params.patientId })
    .populate('doctor', 'name')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
};

module.exports = { createPrescription, getMyPrescriptions, getPatientPrescriptions };
