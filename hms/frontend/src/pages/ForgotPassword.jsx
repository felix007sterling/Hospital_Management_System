import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setToken(data.resetToken || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    }
    setBusy(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card glass" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        <p className="subtitle">Enter your account email</p>
        {error && <div className="error-msg">{error}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" disabled={busy}>{busy ? 'Requesting...' : 'Get Reset Token'}</button>

        {token && (
          <div className="error-msg" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--success)', borderColor: 'rgba(52,211,153,0.3)', wordBreak: 'break-all' }}>
            Demo mode (no email service connected): your reset token is<br /><strong>{token}</strong><br />
            <Link to="/reset-password">Go to reset page &rarr;</Link>
          </div>
        )}

        <p className="switch-link"><Link to="/login">Back to login</Link></p>
      </form>
    </div>
  );
};

export default ForgotPassword;
