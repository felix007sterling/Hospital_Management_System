import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  name: '', email: '', password: '', phone: '',
  age: '', gender: 'male', bloodGroup: '', emergencyContact: '', address: '',
  specialization: '', qualification: '', experience: '', availableDays: '', consultationFee: ''
};

const Register = () => {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({
        ...form,
        role,
        age: form.age ? Number(form.age) : undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card glass" onSubmit={handleSubmit} style={{ maxWidth: 440 }}>
        <h1>Create Account</h1>
        <p className="subtitle">Join MedCore</p>
        {error && <div className="error-msg">{error}</div>}

        <label>I am a</label>
        <div className="role-toggle">
          <button type="button" className={role === 'patient' ? 'role-btn active' : 'role-btn'} onClick={() => setRole('patient')}>Patient</button>
          <button type="button" className={role === 'doctor' ? 'role-btn active' : 'role-btn'} onClick={() => setRole('doctor')}>Doctor</button>
          <button type="button" className={role === 'admin' ? 'role-btn active' : 'role-btn'} onClick={() => setRole('admin')}>Admin</button>
        </div>

        <label>Full Name</label>
        <input value={form.name} onChange={set('name')} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={set('email')} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={set('password')} minLength={6} required />
        <label>Phone</label>
        <input value={form.phone} onChange={set('phone')} />

        {role === 'patient' && (
          <>
            <div className="form-row">
              <div>
                <label>Age</label>
                <input type="number" min="0" value={form.age} onChange={set('age')} required />
              </div>
              <div>
                <label>Gender</label>
                <select value={form.gender} onChange={set('gender')}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <label>Blood Group</label>
            <input placeholder="e.g. O+" value={form.bloodGroup} onChange={set('bloodGroup')} required />
            <label>Emergency Contact</label>
            <input value={form.emergencyContact} onChange={set('emergencyContact')} required />
            <label>Address (optional)</label>
            <input value={form.address} onChange={set('address')} />
          </>
        )}

        {role === 'doctor' && (
          <>
            <label>Specialization</label>
            <input value={form.specialization} onChange={set('specialization')} required />
            <label>Qualification</label>
            <input value={form.qualification} onChange={set('qualification')} required />
            <label>Experience (years)</label>
            <input type="number" min="0" value={form.experience} onChange={set('experience')} required />
            <label>Available Days (comma separated)</label>
            <input placeholder="Mon, Wed, Fri" value={form.availableDays} onChange={set('availableDays')} />
            <label>Consultation Fee</label>
            <input type="number" min="0" value={form.consultationFee} onChange={set('consultationFee')} required />
          </>
        )}

        {role === 'admin' && (
          <p className="course-meta" style={{ margin: '4px 0 14px' }}>
            No extra profile fields needed for an admin account.
          </p>
        )}

        <button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Register'}</button>
        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
