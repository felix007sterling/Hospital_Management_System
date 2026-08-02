import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import api from '../api/axios';
import Layout from '../components/Layout';
import Reveal from '../components/Reveal';

const PIE_COLORS = ['#e11d48', '#0d9488', '#8b5cf6', '#f59e0b'];

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/reports').then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><div className="full-loader"><div className="spinner" /></div></Layout>;

  const dailyData = data.dailyAppointments.map((d) => ({ day: d._id.slice(5), count: d.count }));
  const revenueData = data.monthlyRevenue.map((m) => ({ month: m._id, total: m.total }));
  const doctorData = data.doctorPerformance.map((d) => ({ name: d.doctorName, completed: d.completedAppointments }));
  const genderData = data.patientGenderStats.map((g) => ({ name: g._id, value: g.count }));

  return (
    <Layout>
      <h1 className="page-title">Reports & Analytics</h1>

      <Reveal>
        <div className="panel glass">
          <h2>Daily Appointments (Last 7 Days)</h2>
          {dailyData.length === 0 ? <div className="empty-state">No appointment data yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="day" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Bar dataKey="count" fill="#e11d48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="panel glass">
          <h2>Monthly Revenue</h2>
          {revenueData.length === 0 ? <div className="empty-state">No revenue data yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="panel glass">
          <h2>Doctor Performance (Completed Consultations)</h2>
          {doctorData.length === 0 ? <div className="empty-state">No completed appointments yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={doctorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis type="number" stroke="var(--text-secondary)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={120} />
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Bar dataKey="completed" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>

      <Reveal delay={240}>
        <div className="panel glass">
          <h2>Patient Demographics (Gender)</h2>
          {genderData.length === 0 ? <div className="empty-state">No patient data yet.</div> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--glass-border)', borderRadius: 10 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Reveal>
    </Layout>
  );
};

export default Reports;
