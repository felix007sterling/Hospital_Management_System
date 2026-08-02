import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/prescriptions/mine').then(({ data }) => {
      setPrescriptions(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Prescriptions</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : prescriptions.length === 0 ? (
        <div className="empty-state glass">No prescriptions yet.</div>
      ) : (
        <div className="reg-list">
          {prescriptions.map((p, i) => (
            <Reveal key={p._id} delay={i * 40}>
              <div className="record-item glass">
                <div className="record-header">
                  <h3>Dr. {p.doctor?.name}</h3>
                  <span className="course-meta">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <table className="data-table" style={{ marginTop: 10 }}>
                  <thead>
                    <tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th></tr>
                  </thead>
                  <tbody>
                    {p.medicines.map((m, idx) => (
                      <tr key={idx}>
                        <td>{m.name}</td><td>{m.dosage}</td><td>{m.frequency}</td><td>{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {p.instructions && <p className="course-meta" style={{ marginTop: 10 }}><strong>Instructions:</strong> {p.instructions}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyPrescriptions;
