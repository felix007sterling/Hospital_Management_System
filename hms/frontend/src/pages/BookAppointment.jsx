import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/doctors', { params: {} }).then(({ data }) => {
      const found = data.find((d) => d.user?._id === doctorId);
      setDoctor(found);
    });
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/appointments', { doctor: doctorId, date, time, reason });
      navigate('/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
    setBusy(false);
  };

  return (
    <Layout>
      <h1 className="page-title">Book Appointment</h1>

      <form className="form-card glass" onSubmit={handleSubmit}>
        {doctor && (
          <p className="course-meta" style={{ marginBottom: 14 }}>
            With Dr. {doctor.user?.name} — {doctor.specialization} · ₹{doctor.consultationFee}
          </p>
        )}
        {error && <div className="error-msg">{error}</div>}

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <label>Time</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <label>Reason for visit (optional)</label>
        <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />

        <button type="submit" disabled={busy}>{busy ? 'Booking...' : 'Confirm Booking'}</button>
      </form>
    </Layout>
  );
};

export default BookAppointment;
