import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const DoctorListing = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (specialization) params.specialization = specialization;
    const { data } = await api.get('/doctors', { params });
    setDoctors(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <Layout>
      <h1 className="page-title">Find a Doctor</h1>

      <form className="filter-bar glass" onSubmit={handleSubmit}>
        <input placeholder="Search by doctor name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <input placeholder="Filter by specialization..." value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="empty-state">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="empty-state glass">No doctors found.</div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((d, i) => (
            <Reveal key={d._id} delay={Math.min(i * 40, 300)}>
              <div className="doctor-card glass">
                <div className="doctor-avatar">{d.user?.name?.charAt(0)}</div>
                <h3>Dr. {d.user?.name}</h3>
                <p className="course-meta">{d.specialization}</p>
                <p className="course-meta">{d.qualification} · {d.experience} yrs experience</p>
                <p className="course-meta">Available: {d.availableDays?.join(', ') || 'Not specified'}</p>
                <p className="fee-tag">₹{d.consultationFee} consultation fee</p>
                <Link to={`/book/${d.user?._id}`}><button style={{ width: '100%', marginTop: 10 }}>Book Appointment</button></Link>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default DoctorListing;
