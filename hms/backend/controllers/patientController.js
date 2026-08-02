const PatientProfile = require('../models/PatientProfile');

const getMyProfile = async (req, res) => {
  const profile = await PatientProfile.findOne({ user: req.user._id }).populate('user', 'name email phone');
  if (!profile) return res.status(404).json({ message: 'Profile not found' });
  res.json(profile);
};

const updateMyProfile = async (req, res) => {
  const profile = await PatientProfile.findOne({ user: req.user._id });
  if (!profile) return res.status(404).json({ message: 'Profile not found' });

  const { age, gender, bloodGroup, address, emergencyContact } = req.body;
  Object.assign(profile, { age, gender, bloodGroup, address, emergencyContact });
  await profile.save();
  res.json(profile);
};

const getPatients = async (req, res) => {
  const { search } = req.query;
  let patients = await PatientProfile.find().populate('user', 'name email phone');

  if (search) {
    const s = search.toLowerCase();
    patients = patients.filter((p) => p.user && p.user.name.toLowerCase().includes(s));
  }

  res.json(patients);
};

const getPatient = async (req, res) => {
  const profile = await PatientProfile.findOne({ user: req.params.userId }).populate('user', 'name email phone');
  if (!profile) return res.status(404).json({ message: 'Patient not found' });
  res.json(profile);
};

module.exports = { getMyProfile, updateMyProfile, getPatients, getPatient };
