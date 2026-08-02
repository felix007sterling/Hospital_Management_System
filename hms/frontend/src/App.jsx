import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import DoctorListing from './pages/DoctorListing';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MyRecords from './pages/MyRecords';
import MyPrescriptions from './pages/MyPrescriptions';
import MyInvoices from './pages/MyInvoices';
import DoctorSchedule from './pages/DoctorSchedule';
import AppointmentWorkspace from './pages/AppointmentWorkspace';
import DoctorPatients from './pages/DoctorPatients';
import ManageDoctors from './pages/ManageDoctors';
import ManagePatients from './pages/ManagePatients';
import AllAppointments from './pages/AllAppointments';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Patient */}
      <Route path="/doctors" element={<ProtectedRoute role="patient"><DoctorListing /></ProtectedRoute>} />
      <Route path="/book/:doctorId" element={<ProtectedRoute role="patient"><BookAppointment /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute role="patient"><MyAppointments /></ProtectedRoute>} />
      <Route path="/records" element={<ProtectedRoute role="patient"><MyRecords /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute role="patient"><MyPrescriptions /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute role="patient"><MyInvoices /></ProtectedRoute>} />

      {/* Doctor */}
      <Route path="/schedule" element={<ProtectedRoute role="doctor"><DoctorSchedule /></ProtectedRoute>} />
      <Route path="/appointments/:id/workspace" element={<ProtectedRoute role="doctor"><AppointmentWorkspace /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute role="doctor"><DoctorPatients /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/manage-doctors" element={<ProtectedRoute role="admin"><ManageDoctors /></ProtectedRoute>} />
      <Route path="/manage-patients" element={<ProtectedRoute role="admin"><ManagePatients /></ProtectedRoute>} />
      <Route path="/all-appointments" element={<ProtectedRoute role="admin"><AllAppointments /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
