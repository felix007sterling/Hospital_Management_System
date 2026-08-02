import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const statusPill = (status) => {
  const map = { pending: 'pill-muted', confirmed: 'pill-success', completed: 'pill-success', cancelled: 'pill-danger' };
  return map[status] || 'pill-muted';
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/appointments/mine');
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
    load();
  };

  return (
    <Layout>
      <h1 className="page-title">My Appointments</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state glass">No appointments yet.</div>
      ) : (
        <div className="reg-list">
          {appointments.map((a, i) => (
            <Reveal key={a._id} delay={i * 40}>
              <div className="reg-item glass">
                <div>
                  <h3>Dr. {a.doctor?.name}</h3>
                  <p className="course-meta">{new Date(a.date).toLocaleDateString()} · {a.time}</p>
                  {a.reason && <p className="course-meta">{a.reason}</p>}
                </div>
                <div className="reg-actions">
                  <span className={`pill ${statusPill(a.status)}`}>{a.status}</span>
                  {['pending', 'confirmed'].includes(a.status) && (
                    <button className="danger" onClick={() => handleCancel(a._id)}>Cancel</button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyAppointments;
