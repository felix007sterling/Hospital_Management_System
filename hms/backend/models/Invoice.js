const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
    consultationCharge: { type: Number, required: true, min: 0, default: 0 },
    medicineCharge: { type: Number, min: 0, default: 0 },
    testCharge: { type: Number, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
