import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    const { data } = await api.get('/patients', { params });
    setPatients(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Patients</h1>

      <form className="filter-bar glass" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : patients.length === 0 ? (
        <div className="empty-state glass">No patients found.</div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th>Blood Group</th><th>Emergency Contact</th></tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id}>
                  <td>{p.user?.name}</td>
                  <td>{p.user?.email}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.bloodGroup}</td>
                  <td>{p.emergencyContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default DoctorPatients;
