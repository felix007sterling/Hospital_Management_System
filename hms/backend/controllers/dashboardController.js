const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');
const PatientProfile = require('../models/PatientProfile');

const getAdminDashboard = async (req, res) => {
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  const totalPatients = await User.countDocuments({ role: 'patient' });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todaysAppointments = await Appointment.countDocuments({
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  const revenueAgg = await Invoice.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;

  res.json({ totalDoctors, totalPatients, todaysAppointments, totalRevenue });
};

const getReports = async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const dailyAppointments = await Appointment.aggregate([
    { $match: { date: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthlyRevenue = await Invoice.aggregate([
    { $match: { status: 'paid', createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$total' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const doctorPerformance = await Appointment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$doctor', completedAppointments: { $sum: 1 } } },
    { $sort: { completedAppointments: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'doctor'
      }
    },
    { $unwind: '$doctor' },
    { $project: { doctorName: '$doctor.name', completedAppointments: 1 } }
  ]);

  const genderAgg = await PatientProfile.aggregate([
    { $group: { _id: '$gender', count: { $sum: 1 } } }
  ]);

  res.json({ dailyAppointments, monthlyRevenue, doctorPerformance, patientGenderStats: genderAgg });
};

const getDoctorDashboard = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todaysAppointments = await Appointment.countDocuments({
    doctor: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  const pendingAppointments = await Appointment.countDocuments({
    doctor: req.user._id,
    status: 'pending'
  });

  const totalCompleted = await Appointment.countDocuments({
    doctor: req.user._id,
    status: 'completed'
  });

  res.json({ todaysAppointments, pendingAppointments, totalCompleted });
};

module.exports = { getAdminDashboard, getReports, getDoctorDashboard };
