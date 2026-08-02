const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Appointment = require('../models/Appointment');

const getDoctors = async (req, res) => {
  const { specialization, search } = req.query;
  const query = {};
  if (specialization) query.specialization = specialization;

  let doctors = await DoctorProfile.find(query).populate('user', 'name email phone');

  if (search) {
    const s = search.toLowerCase();
    doctors = doctors.filter((d) => d.user && d.user.name.toLowerCase().includes(s));
  }

  res.json(doctors);
};

const getDoctor = async (req, res) => {
  const doctor = await DoctorProfile.findById(req.params.id).populate('user', 'name email phone');
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

const createDoctor = async (req, res) => {
  const { name, email, password, phone, specialization, qualification, experience, availableDays, consultationFee } = req.body;

  if (!name || !email || !password || !specialization || !qualification || experience == null || !consultationFee) {
    return res.status(400).json({ message: 'Missing required doctor fields' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'A user with this email already exists' });
  }

  const user = await User.create({ name, email, password, phone, role: 'doctor' });
  const profile = await DoctorProfile.create({
    user: user._id,
    specialization,
    qualification,
    experience,
    availableDays: availableDays || [],
    consultationFee
  });

  res.status(201).json({ ...profile.toObject(), user: { _id: user._id, name: user.name, email: user.email } });
};

const updateDoctor = async (req, res) => {
  const profile = await DoctorProfile.findById(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Doctor not found' });

  const { specialization, qualification, experience, availableDays, consultationFee } = req.body;
  Object.assign(profile, { specialization, qualification, experience, availableDays, consultationFee });
  await profile.save();
  res.json(profile);
};

const deleteDoctor = async (req, res) => {
  const profile = await DoctorProfile.findById(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Doctor not found' });

  const activeAppointments = await Appointment.countDocuments({
    doctor: profile.user,
    status: { $in: ['pending', 'confirmed'] }
  });
  if (activeAppointments > 0) {
    return res.status(400).json({ message: 'Cannot remove doctor with active appointments' });
  }

  await User.findByIdAndDelete(profile.user);
  await profile.deleteOne();
  res.json({ message: 'Doctor removed' });
};

module.exports = { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor };
