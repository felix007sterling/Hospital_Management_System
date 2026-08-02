const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const DoctorProfile = require('../models/DoctorProfile');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const register = async (req, res) => {
  const {
    name, email, password, phone, role,
    age, gender, bloodGroup, emergencyContact, address,
    specialization, qualification, experience, availableDays, consultationFee
  } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }
  if (!['patient', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  if (role === 'patient') {
    if (!age || !gender || !bloodGroup || !emergencyContact) {
      return res.status(400).json({ message: 'Please fill all patient profile fields' });
    }
  }
  if (role === 'doctor') {
    if (!specialization || !qualification || experience == null || !consultationFee) {
      return res.status(400).json({ message: 'Please fill all doctor profile fields' });
    }
  }

  const user = await User.create({ name, email, password, phone, role });

  if (role === 'patient') {
    await PatientProfile.create({
      user: user._id,
      age,
      gender,
      bloodGroup,
      emergencyContact,
      address: address || ''
    });
  } else if (role === 'doctor') {
    const daysArr = Array.isArray(availableDays)
      ? availableDays
      : (availableDays || '').split(',').map((d) => d.trim()).filter(Boolean);
    await DoctorProfile.create({
      user: user._id,
      specialization,
      qualification,
      experience,
      availableDays: daysArr,
      consultationFee
    });
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id)
  });
};

const getMe = async (req, res) => {
  res.json(req.user);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: 'If an account exists, a reset link has been generated' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetTokenExpires = Date.now() + 30 * 60 * 1000;
  await user.save();

  res.json({
    message: 'Reset token generated',
    resetToken
  });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  res.json({ message: 'Password reset successful' });
};

module.exports = { register, login, getMe, forgotPassword, resetPassword };
