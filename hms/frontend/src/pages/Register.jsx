import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const emptyForm = { name: '', email: '', password: '', phone: '', age: '', gender: 'male', bloodGroup: '', emergencyContact: '', address: '' };

const Register = () => {
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
      await register({ ...form, age: Number(form.age) });
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
        <h1>Patient Registration</h1>
        <p className="subtitle">Create your MedCore account</p>
        {error && <div className="error-msg">{error}</div>}

        <label>Full Name</label>
        <input value={form.name} onChange={set('name')} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={set('email')} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={set('password')} minLength={6} required />
        <label>Phone</label>
        <input value={form.phone} onChange={set('phone')} />

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

        <button type="submit" disabled={busy}>{busy ? 'Creating...' : 'Register'}</button>
        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
