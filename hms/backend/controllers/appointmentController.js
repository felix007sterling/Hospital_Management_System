const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');

const bookAppointment = async (req, res) => {
  const { doctor: doctorId, date, time, reason } = req.body;

  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: 'Doctor, date and time are required' });
  }

  const doctorProfile = await DoctorProfile.findOne({ user: doctorId });
  if (!doctorProfile) return res.status(404).json({ message: 'Doctor not found' });

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    date,
    time,
    reason: reason || ''
  });

  res.status(201).json(appointment);
};

const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id })
    .populate('doctor', 'name email')
    .sort({ date: -1 });
  res.json(appointments);
};

const getDoctorAppointments = async (req, res) => {
  const { status, date } = req.query;
  const query = { doctor: req.user._id };
  if (status) query.status = status;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    query.date = { $gte: start, $lt: end };
  }

  const appointments = await Appointment.find(query)
    .populate('patient', 'name email phone')
    .sort({ date: 1 });
  res.json(appointments);
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not your appointment' });
  }
  if (req.user.role === 'patient') {
    if (appointment.patient.toString() !== req.user._id.toString() || status !== 'cancelled') {
      return res.status(403).json({ message: 'Patients can only cancel their own appointments' });
    }
  }

  appointment.status = status;
  await appointment.save();
  res.json(appointment);
};

const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate('patient', 'name email')
    .populate('doctor', 'name email')
    .sort({ date: -1 })
    .limit(100);
  res.json(appointments);
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateStatus,
  getAllAppointments
};
