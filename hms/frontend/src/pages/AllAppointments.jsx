import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';

const statusPill = (status) => {
  const map = { pending: 'pill-muted', confirmed: 'pill-success', completed: 'pill-success', cancelled: 'pill-danger' };
  return map[status] || 'pill-muted';
};

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments').then(({ data }) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <h1 className="page-title">All Appointments</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state glass">No appointments yet.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.name}</td>
                  <td>Dr. {a.doctor?.name}</td>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.time}</td>
                  <td><span className={`pill ${statusPill(a.status)}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AllAppointments;
