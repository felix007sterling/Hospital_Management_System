import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const emptyForm = { name: '', email: '', password: '', phone: '', specialization: '', qualification: '', experience: '', availableDays: '', consultationFee: '' };

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get('/doctors');
    setDoctors(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (d) => {
    setForm({
      name: d.user?.name || '', email: d.user?.email || '', password: '', phone: d.user?.phone || '',
      specialization: d.specialization, qualification: d.qualification, experience: d.experience,
      availableDays: (d.availableDays || []).join(', '), consultationFee: d.consultationFee
    });
    setEditingId(d._id);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const availableDaysArr = form.availableDays.split(',').map((d) => d.trim()).filter(Boolean);
      if (editingId) {
        await api.put(`/doctors/${editingId}`, {
          specialization: form.specialization,
          qualification: form.qualification,
          experience: Number(form.experience),
          availableDays: availableDaysArr,
          consultationFee: Number(form.consultationFee)
        });
      } else {
        await api.post('/doctors', {
          ...form,
          experience: Number(form.experience),
          availableDays: availableDaysArr,
          consultationFee: Number(form.consultationFee)
        });
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
    setBusy(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this doctor?')) return;
    try {
      await api.delete(`/doctors/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Manage Doctors</h1>
        <button onClick={openCreate}>+ Add Doctor</button>
      </div>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : doctors.length === 0 ? (
        <div className="empty-state glass">No doctors added yet.</div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((d, i) => (
            <Reveal key={d._id} delay={Math.min(i * 40, 300)}>
              <div className="doctor-card glass">
                <div className="doctor-avatar">{d.user?.name?.charAt(0)}</div>
                <h3>Dr. {d.user?.name}</h3>
                <p className="course-meta">{d.specialization}</p>
                <p className="course-meta">{d.qualification} · {d.experience} yrs</p>
                <p className="fee-tag">₹{d.consultationFee}</p>
                <div className="owner-actions" style={{ marginTop: 10, marginLeft: 0, justifyContent: 'center' }}>
                  <button className="secondary" onClick={() => openEdit(d)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(d._id)}>Remove</button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <form className="modal-card glass" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Doctor' : 'Add Doctor'}</h2>
            {error && <div className="error-msg">{error}</div>}

            {!editingId && (
              <>
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <label>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required />
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </>
            )}

            <label>Specialization</label>
            <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
            <label>Qualification</label>
            <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} required />
            <label>Experience (years)</label>
            <input type="number" min="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} required />
            <label>Available Days (comma separated)</label>
            <input placeholder="Mon, Wed, Fri" value={form.availableDays} onChange={(e) => setForm({ ...form, availableDays: e.target.value })} />
            <label>Consultation Fee</label>
            <input type="number" min="0" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} required />

            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" disabled={busy}>Save</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default ManageDoctors;
