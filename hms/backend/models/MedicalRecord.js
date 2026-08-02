const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
    symptoms: { type: String, required: true, trim: true },
    diagnosis: { type: String, required: true, trim: true },
    testResults: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    reportFile: {
      name: String,
      data: String,
      contentType: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
