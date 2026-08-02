import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const MyRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/records/mine').then(({ data }) => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Medical Records</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : records.length === 0 ? (
        <div className="empty-state glass">No medical records yet.</div>
      ) : (
        <div className="reg-list">
          {records.map((r, i) => (
            <Reveal key={r._id} delay={i * 40}>
              <div className="record-item glass">
                <div className="record-header">
                  <h3>Dr. {r.doctor?.name}</h3>
                  <span className="course-meta">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="course-meta"><strong>Symptoms:</strong> {r.symptoms}</p>
                <p className="course-meta"><strong>Diagnosis:</strong> {r.diagnosis}</p>
                {r.testResults && <p className="course-meta"><strong>Test Results:</strong> {r.testResults}</p>}
                {r.notes && <p className="course-meta"><strong>Notes:</strong> {r.notes}</p>}
                {r.reportFile?.name && <p className="course-meta"><strong>Report file:</strong> {r.reportFile.name}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyRecords;
