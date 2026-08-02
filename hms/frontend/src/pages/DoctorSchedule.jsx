import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const statusPill = (status) => {
  const map = { pending: 'pill-muted', confirmed: 'pill-success', completed: 'pill-success', cancelled: 'pill-danger' };
  return map[status] || 'pill-muted';
};

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    const { data } = await api.get('/appointments/doctor', { params });
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    load();
  };

  return (
    <Layout>
      <h1 className="page-title">My Schedule</h1>

      <div className="filter-bar glass">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state glass">No appointments found.</div>
      ) : (
        <div className="reg-list">
          {appointments.map((a, i) => (
            <Reveal key={a._id} delay={Math.min(i * 30, 300)}>
              <div className="reg-item glass">
                <div>
                  <h3>{a.patient?.name}</h3>
                  <p className="course-meta">{new Date(a.date).toLocaleDateString()} · {a.time}</p>
                  {a.reason && <p className="course-meta">{a.reason}</p>}
                </div>
                <div className="reg-actions">
                  <span className={`pill ${statusPill(a.status)}`}>{a.status}</span>
                  {a.status === 'pending' && <button onClick={() => handleStatus(a._id, 'confirmed')}>Confirm</button>}
                  {a.status === 'confirmed' && <button onClick={() => handleStatus(a._id, 'completed')}>Mark Completed</button>}
                  {['pending', 'confirmed'].includes(a.status) && (
                    <button className="danger" onClick={() => handleStatus(a._id, 'cancelled')}>Cancel</button>
                  )}
                  <Link to={`/appointments/${a._id}/workspace?patientId=${a.patient?._id}`}>
                    <button className="secondary">Open</button>
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default DoctorSchedule;
