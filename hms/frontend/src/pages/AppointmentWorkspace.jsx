import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const AppointmentWorkspace = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [recordForm, setRecordForm] = useState({ symptoms: '', diagnosis: '', testResults: '', notes: '' });
  const [reportFile, setReportFile] = useState(null);
  const [recordMsg, setRecordMsg] = useState('');
  const [recordBusy, setRecordBusy] = useState(false);

  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '' }]);
  const [instructions, setInstructions] = useState('');
  const [rxMsg, setRxMsg] = useState('');
  const [rxBusy, setRxBusy] = useState(false);

  const [medicineCharge, setMedicineCharge] = useState('');
  const [testCharge, setTestCharge] = useState('');
  const [invoiceMsg, setInvoiceMsg] = useState('');
  const [invoiceBusy, setInvoiceBusy] = useState(false);

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    setRecordBusy(true);
    setRecordMsg('');
    try {
      const formData = new FormData();
      formData.append('patient', patientId);
      formData.append('appointment', id);
      formData.append('symptoms', recordForm.symptoms);
      formData.append('diagnosis', recordForm.diagnosis);
      formData.append('testResults', recordForm.testResults);
      formData.append('notes', recordForm.notes);
      if (reportFile) formData.append('report', reportFile);

      await api.post('/records', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setRecordMsg('Medical record saved.');
      setRecordForm({ symptoms: '', diagnosis: '', testResults: '', notes: '' });
      setReportFile(null);
    } catch (err) {
      setRecordMsg(err.response?.data?.message || 'Failed to save record');
    }
    setRecordBusy(false);
  };

  const updateMedicine = (idx, field, value) => {
    setMedicines((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };
  const addMedicineRow = () => setMedicines((prev) => [...prev, { name: '', dosage: '', frequency: '', duration: '' }]);

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setRxBusy(true);
    setRxMsg('');
    try {
      await api.post('/prescriptions', {
        patient: patientId,
        appointment: id,
        medicines: medicines.filter((m) => m.name),
        instructions
      });
      setRxMsg('Prescription created.');
      setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
      setInstructions('');
    } catch (err) {
      setRxMsg(err.response?.data?.message || 'Failed to create prescription');
    }
    setRxBusy(false);
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    setInvoiceBusy(true);
    setInvoiceMsg('');
    try {
      const { data } = await api.post('/invoices', {
        patient: patientId,
        appointment: id,
        medicineCharge: Number(medicineCharge) || 0,
        testCharge: Number(testCharge) || 0
      });
      setInvoiceMsg(`Invoice generated. Total: ₹${data.total}`);
      setMedicineCharge('');
      setTestCharge('');
    } catch (err) {
      setInvoiceMsg(err.response?.data?.message || 'Failed to generate invoice');
    }
    setInvoiceBusy(false);
  };

  return (
    <Layout>
      <Link to="/schedule" className="link-more">&larr; Back to schedule</Link>
      <h1 className="page-title" style={{ marginTop: 10 }}>Consultation Workspace</h1>

      <Reveal>
        <div className="panel glass">
          <h2>Add Medical Record</h2>
          {recordMsg && <div className="error-msg" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--success)', borderColor: 'rgba(52,211,153,0.3)' }}>{recordMsg}</div>}
          <form onSubmit={handleRecordSubmit}>
            <label>Symptoms</label>
            <textarea rows={2} value={recordForm.symptoms} onChange={(e) => setRecordForm({ ...recordForm, symptoms: e.target.value })} required />
            <label>Diagnosis</label>
            <textarea rows={2} value={recordForm.diagnosis} onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })} required />
            <label>Test Results (optional)</label>
            <textarea rows={2} value={recordForm.testResults} onChange={(e) => setRecordForm({ ...recordForm, testResults: e.target.value })} />
            <label>Clinical Notes (optional)</label>
            <textarea rows={2} value={recordForm.notes} onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })} />
            <label>Attach Test Report (optional)</label>
            <input type="file" onChange={(e) => setReportFile(e.target.files[0])} />
            <button type="submit" disabled={recordBusy}>{recordBusy ? 'Saving...' : 'Save Record'}</button>
          </form>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="panel glass">
          <h2>Create Prescription</h2>
          {rxMsg && <div className="error-msg" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--success)', borderColor: 'rgba(52,211,153,0.3)' }}>{rxMsg}</div>}
          <form onSubmit={handlePrescriptionSubmit}>
            {medicines.map((m, idx) => (
              <div key={idx} className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                <input placeholder="Medicine" value={m.name} onChange={(e) => updateMedicine(idx, 'name', e.target.value)} />
                <input placeholder="Dosage" value={m.dosage} onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)} />
                <input placeholder="Frequency" value={m.frequency} onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)} />
                <input placeholder="Duration" value={m.duration} onChange={(e) => updateMedicine(idx, 'duration', e.target.value)} />
              </div>
            ))}
            <button type="button" className="secondary" onClick={addMedicineRow} style={{ marginBottom: 12 }}>+ Add Medicine</button>
            <label>Instructions (optional)</label>
            <textarea rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            <button type="submit" disabled={rxBusy}>{rxBusy ? 'Saving...' : 'Create Prescription'}</button>
          </form>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="panel glass">
          <h2>Generate Invoice</h2>
          {invoiceMsg && <div className="error-msg" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--success)', borderColor: 'rgba(52,211,153,0.3)' }}>{invoiceMsg}</div>}
          <form onSubmit={handleInvoiceSubmit}>
            <p className="course-meta" style={{ marginBottom: 10 }}>Consultation charge is applied automatically from your profile fee.</p>
            <div className="form-row">
              <div>
                <label>Medicine Charge (optional)</label>
                <input type="number" min="0" value={medicineCharge} onChange={(e) => setMedicineCharge(e.target.value)} />
              </div>
              <div>
                <label>Test Charge (optional)</label>
                <input type="number" min="0" value={testCharge} onChange={(e) => setTestCharge(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={invoiceBusy}>{invoiceBusy ? 'Generating...' : 'Generate Invoice'}</button>
          </form>
        </div>
      </Reveal>
    </Layout>
  );
};

export default AppointmentWorkspace;
