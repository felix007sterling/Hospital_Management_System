import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await api.get('/invoices/mine');
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handlePay = async (id) => {
    setBusy(true);
    await api.put(`/invoices/${id}/pay`);
    await load();
    setBusy(false);
  };

  return (
    <Layout>
      <h1 className="page-title">Billing</h1>

      {loading ? (
        <div className="empty-state">Loading...</div>
      ) : invoices.length === 0 ? (
        <div className="empty-state glass">No invoices yet.</div>
      ) : (
        <div className="reg-list">
          {invoices.map((inv, i) => (
            <Reveal key={inv._id} delay={i * 40}>
              <div className="reg-item glass">
                <div>
                  <h3>Dr. {inv.doctor?.name}</h3>
                  <p className="course-meta">Consultation ₹{inv.consultationCharge} · Medicine ₹{inv.medicineCharge} · Tests ₹{inv.testCharge}</p>
                  <p className="fee-tag">Total: ₹{inv.total}</p>
                </div>
                <div className="reg-actions">
                  <span className={`pill ${inv.status === 'paid' ? 'pill-success' : 'pill-danger'}`}>{inv.status}</span>
                  {inv.status === 'pending' && (
                    <button onClick={() => handlePay(inv._id)} disabled={busy}>Pay Now</button>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyInvoices;
