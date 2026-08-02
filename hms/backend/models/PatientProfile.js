const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    bloodGroup: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: '' },
    emergencyContact: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
