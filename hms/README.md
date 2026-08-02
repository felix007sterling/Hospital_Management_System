# MedCore — Hospital Management System (MERN + JWT)

## Three Roles, One System
- **Patient**: register, find/search doctors, book appointments, view medical records, prescriptions, and bills
- **Doctor**: view schedule, confirm/complete/cancel appointments, add medical records & prescriptions, generate invoices
- **Admin**: manage doctor accounts, view all patients/appointments, dashboard analytics & reports

## Eight Core Modules (per brief)
1. **Authentication** — JWT login, role-based access control, patient self-registration, forgot/reset password
2. **Doctor Management** — admin adds/edits/removes doctor profiles; specialization, qualification, experience, availability, fee
3. **Patient Management** — registration with full profile (age, gender, blood group, emergency contact), centralized record
4. **Appointments** — search doctors, book by date/time, status flow (pending → confirmed → completed / cancelled), view history
5. **Medical Records** — doctors log symptoms, diagnosis, test results, notes; optional test report file upload
6. **Prescriptions** — structured digital prescriptions (medicine, dosage, frequency, duration) + instructions; patients view/download
7. **Billing** — auto-calculated consultation charge (from doctor's fee) + medicine/test charges, itemized invoice, payment status
8. **Admin Dashboard & Analytics** — total doctors/patients, today's appointments, total revenue, plus 4 report charts (daily appointments, monthly revenue, doctor performance, patient demographics)

## Tech Stack
- Frontend: React 18, Vite, React Router, Axios, Recharts (report charts)
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT (jsonwebtoken + bcryptjs)
- File handling: Multer (in-memory) → base64 in MongoDB for test report uploads
- Styling: Custom CSS — glassmorphism, dark/light theme toggle, scroll animations, rose/teal/violet palette

## Folder Structure
```
hms/
├── backend/
│   ├── config/db.js
│   ├── models/          User, DoctorProfile, PatientProfile, Appointment,
│   │                    MedicalRecord, Prescription, Invoice
│   ├── controllers/      auth, doctor, patient, appointment, record,
│   │                    prescription, invoice, dashboard
│   ├── routes/
│   ├── middleware/       auth (JWT + role check), upload, errorHandler
│   └── server.js
└── frontend/
    └── src/
        ├── pages/         Login, Register, ForgotPassword, ResetPassword,
        │                  Dashboard (role-aware), DoctorListing, BookAppointment,
        │                  MyAppointments, MyRecords, MyPrescriptions, MyInvoices,
        │                  DoctorSchedule, AppointmentWorkspace, DoctorPatients,
        │                  ManageDoctors, ManagePatients, AllAppointments, Reports
        ├── components/    Layout (role-aware nav), ProtectedRoute, Reveal
        ├── context/       AuthContext (JWT), ThemeContext
        ├── hooks/         useScrollReveal
        ├── api/axios.js
        └── index.css
```

## How roles are provisioned
- **Patients** self-register via the public Register page (creates User + PatientProfile together)
- **Doctors** are created only by an Admin via Manage Doctors → Add Doctor (creates User + DoctorProfile together) — this matches real hospital systems where clinical staff accounts are provisioned by administration, not self-signup
- **Admin** account must be created directly in the database the first time (see "Creating your first admin" below), since there's no public admin signup by design

## Creating your first admin
No UI for this on purpose (admin shouldn't be self-serve). After deploying, connect to your MongoDB Atlas cluster and either:
- Manually insert a document into the `users` collection with `role: "admin"` and a bcrypt-hashed password, or
- Temporarily register as a patient, then edit that user's `role` field to `"admin"` directly in Atlas's data browser

## Business rules enforced server-side
- Only a doctor can confirm/complete an appointment; only a patient can cancel their own
- Only the assigned doctor can add records/prescriptions/invoices for an appointment
- Consultation charge on an invoice is pulled automatically from the doctor's own profile fee, not manually entered
- Admin cannot delete a doctor who has active (pending/confirmed) appointments

## Backend setup
```
cd backend
npm install
cp .env.example .env
```
Fill in `MONGO_URI` and `JWT_SECRET`.
```
npm run dev
```

## Frontend setup
```
cd frontend
npm install
cp .env.example .env
```
Fill in `VITE_API_URL`.
```
npm run dev
```

## Deploy
Same pattern as previous projects: Vercel (frontend) + Render (backend) + MongoDB Atlas (database).
`vercel.json` included for SPA routing.

## Known simplifications (good to mention in review)
- **Forgot Password** returns the reset token directly in the API response instead of emailing it — there's no email service (e.g. Nodemailer + SMTP) wired up. In production this token would be emailed, never shown in the UI.
- **File storage**: test report uploads are stored as base64 inside MongoDB (same reasoning as the LMS project — Render's free tier disk is ephemeral). A production system would use Cloudinary or S3.
- **Bonus features not implemented**: Video Consultations, SMS Appointment Reminders, Lab & Pharmacy inventory, Doctor Ratings — these were listed as "bonus challenges" beyond the 8 core modules; the system is architected so any of these could be added as new models/routes without restructuring existing ones.
