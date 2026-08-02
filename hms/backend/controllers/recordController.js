const MedicalRecord = require('../models/MedicalRecord');

const createRecord = async (req, res) => {
  const { patient, appointment, symptoms, diagnosis, testResults, notes } = req.body;

  if (!patient || !symptoms || !diagnosis) {
    return res.status(400).json({ message: 'Patient, symptoms and diagnosis are required' });
  }

  const record = await MedicalRecord.create({
    patient,
    doctor: req.user._id,
    appointment: appointment || null,
    symptoms,
    diagnosis,
    testResults: testResults || '',
    notes: notes || '',
    reportFile: req.file
      ? {
          name: req.file.originalname,
          data: req.file.buffer.toString('base64'),
          contentType: req.file.mimetype
        }
      : undefined
  });

  res.status(201).json(record);
};

const getMyRecords = async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.user._id })
    .populate('doctor', 'name')
    .select('-reportFile.data')
    .sort({ createdAt: -1 });
  res.json(records);
};

const getPatientRecords = async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.params.patientId })
    .populate('doctor', 'name')
    .select('-reportFile.data')
    .sort({ createdAt: -1 });
  res.json(records);
};

module.exports = { createRecord, getMyRecords, getPatientRecords };
