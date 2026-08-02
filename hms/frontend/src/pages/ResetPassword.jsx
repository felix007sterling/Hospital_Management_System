import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
    setBusy(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card glass" onSubmit={handleSubmit}>
        <h1>Set New Password</h1>
        <p className="subtitle">Paste your reset token below</p>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="error-msg" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--success)', borderColor: 'rgba(52,211,153,0.3)' }}>Password reset. Redirecting to login...</div>}
        <label>Reset Token</label>
        <input value={token} onChange={(e) => setToken(e.target.value)} required />
        <label>New Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        <button type="submit" disabled={busy}>{busy ? 'Resetting...' : 'Reset Password'}</button>
        <p className="switch-link"><Link to="/login">Back to login</Link></p>
      </form>
    </div>
  );
};

export default ResetPassword;
