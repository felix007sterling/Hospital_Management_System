require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app = express();

// Static allowed origins from env (comma-separated), e.g.
// CLIENT_URL=https://hospital-management-system.vercel.app,http://localhost:3000
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [];

// Regex to allow any Vercel preview deployment under this project
// Matches: https://hospital-management-system-<hash>-prem-0007s-projects.vercel.app
const vercelPreviewPattern = /^https:\/\/hospital-management-system-.*-prem-0007s-projects\.vercel\.app$/;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests (curl, Postman, server-to-server) with no origin header
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => res.json({ prem: 'hello' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
