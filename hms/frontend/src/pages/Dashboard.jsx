import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (user.role === 'admin') {
        const { data: d } = await api.get('/dashboard/admin');
        setData(d);
      } else if (user.role === 'doctor') {
        const { data: d } = await api.get('/dashboard/doctor');
        setData(d);
      } else {
        const [{ data: appts }, { data: invoices }] = await Promise.all([
          api.get('/appointments/mine'),
          api.get('/invoices/mine')
        ]);
        const upcoming = appts.filter((a) => ['pending', 'confirmed'].includes(a.status));
        const pendingInvoices = invoices.filter((i) => i.status === 'pending');
        setData({ upcomingCount: upcoming.length, nextAppointment: upcoming[0], pendingInvoiceCount: pendingInvoices.length });
      }
      setLoading(false);
    };
    load();
  }, [user.role]);

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;

  return (
    <Layout>
      <h1 className="page-title">Welcome, {user.name}</h1>

      {user.role === 'admin' && (
        <div className="stat-grid">
          <div className="stat-card glass"><span className="stat-label">Total Doctors</span><span className="stat-value">{data.totalDoctors}</span></div>
          <div className="stat-card glass"><span className="stat-label">Total Patients</span><span className="stat-value">{data.totalPatients}</span></div>
          <div className="stat-card glass"><span className="stat-label">Today's Appointments</span><span className="stat-value">{data.todaysAppointments}</span></div>
          <div className="stat-card glass"><span className="stat-label">Total Revenue</span><span className="stat-value">₹{data.totalRevenue}</span></div>
        </div>
      )}

      {user.role === 'doctor' && (
        <div className="stat-grid">
          <div className="stat-card glass"><span className="stat-label">Today's Appointments</span><span className="stat-value">{data.todaysAppointments}</span></div>
          <div className="stat-card glass"><span className="stat-label">Pending Approvals</span><span className="stat-value">{data.pendingAppointments}</span></div>
          <div className="stat-card glass"><span className="stat-label">Completed Consultations</span><span className="stat-value">{data.totalCompleted}</span></div>
        </div>
      )}

      {user.role === 'patient' && (
        <>
          <div className="stat-grid">
            <div className="stat-card glass"><span className="stat-label">Upcoming Appointments</span><span className="stat-value">{data.upcomingCount}</span></div>
            <div className="stat-card glass"><span className="stat-label">Pending Bills</span><span className="stat-value">{data.pendingInvoiceCount}</span></div>
          </div>
          <Reveal>
            <div className="panel glass">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <Link to="/doctors"><button>Find a Doctor</button></Link>
                <Link to="/appointments"><button className="secondary">My Appointments</button></Link>
                <Link to="/records"><button className="secondary">Medical Records</button></Link>
                <Link to="/prescriptions"><button className="secondary">Prescriptions</button></Link>
                <Link to="/invoices"><button className="secondary">Billing</button></Link>
              </div>
            </div>
          </Reveal>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
