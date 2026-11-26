
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config';
import './ReportsLayout.css';

const ReportsLayout = ({ user }) => {
  const [patient, setPatient] = useState(user || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchPatient = async () => {
      const token = sessionStorage.getItem('auth-token');
      const email =
        user?.email || sessionStorage.getItem('email');

      if (!token || !email) {
        if (active) {
          setError('Please log in to view your medical report.');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            email: email
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || 'Unable to fetch patient details.'
          );
        }

        if (active) {
          setPatient(data.user || data);
          setError('');
        }
      } catch (err) {
        console.error('Patient report error:', err);

        if (active) {
          // Keep any user data already supplied by the parent.
          if (!user) setError(err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPatient();

    return () => {
      active = false;
    };
  }, [user]);

  const formatValue = (value) => {
    if (value === undefined || value === null || value === '') {
      return 'Not provided';
    }

    return String(value);
  };

  const patientName = patient.name || patient.fullName || '';

  const reportFields = [
    ['Patient Name', patientName],
    ['Email Address', patient.email],
    ['Phone Number', patient.phone],
    ['Blood Group', patient.bloodGroup],
    ['Sex', patient.sex],
    [
      'Date of Birth',
      patient.dob ? String(patient.dob).substring(0, 10) : ''
    ],
    ['Height', patient.height ? `${patient.height} cm` : ''],
    ['Weight', patient.weight ? `${patient.weight} kg` : ''],
    ['Address', patient.address],
    ['Emergency Contact', patient.emergencyContact]
  ];

  const downloadReport = () => {
    const rows = reportFields.map(([label, value]) => `
      <tr>
        <th>${formatValue(label)}</th>
        <td>${formatValue(value)}</td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow pop-ups to download your report.');
      return;
    }

    // Escape values before inserting them into the report HTML.
    const safeRows = reportFields.map(([label, value]) => `
      <tr>
        <th>${escapeHTML(label)}</th>
        <td>${escapeHTML(formatValue(value))}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Medical Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 35px;
            color: #173b65;
          }
          h1 { color: #087bff; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
          }
          th, td {
            border: 1px solid #dce5ef;
            padding: 14px;
            text-align: left;
          }
          th {
            background: #edf5ff;
            width: 35%;
          }
        </style>
      </head>
      <body>
        <h1>StayHealthy</h1>
        <h2>Patient Medical Report</h2>
        <p>Personal information of the logged-in patient</p>
        <table>${safeRows}</table>
        <p>Generated from StayHealthy.</p>
        <script>
          window.onload = function() {
            window.print();
          };
        <\/script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);

  if (loading) {
    return (
      <div className="reports-container">
        <h2>My Medical Reports</h2>
        <p>Loading your patient information...</p>
      </div>
    );
  }

  return (
    <div className="reports-container">

      <h2>My Medical Reports</h2>
      <p>View and download your medical reports.</p>

      {error && (
        <div className="report-error">
          {error}
        </div>
      )}

      <div className="report-card">

        <div className="report-icon">📄</div>

        <div className="report-details">
          <h3>Patient Medical Report</h3>
          <p>{patientName || 'Patient Report'}</p>
        </div>

        <div className="report-actions">

          <button
            className="view-report-btn"
            onClick={() => setShowReport(true)}
          >
            View Report
          </button>

          <button
            className="download-report-btn"
            onClick={downloadReport}
          >
            Download Report
          </button>

        </div>
      </div>

      {showReport && (
        <div
          className="patient-report-overlay"
          onClick={() => setShowReport(false)}
        >
          <div
            className="patient-report-modal"
            onClick={e => e.stopPropagation()}
          >

            <div className="report-modal-header">
              <div>
                <h2>StayHealthy</h2>
                <p>Patient Medical Report</p>
              </div>

              <button
                className="close-report-btn"
                onClick={() => setShowReport(false)}
              >
                ×
              </button>
            </div>

            <div className="patient-report-content">

              <h3>Patient Details</h3>

              <div className="patient-report-grid">
                {reportFields.map(([label, value]) => (
                  <div key={label}>
                    <label>{label}</label>
                    <p>{formatValue(value)}</p>
                  </div>
                ))}
              </div>

              <p className="report-note">
                This report contains the personal information
                of the currently logged-in patient.
              </p>

            </div>

            <div className="report-modal-actions">

              <button
                className="download-report-btn"
                onClick={downloadReport}
              >
                Download Report
              </button>

              <button
                className="cancel-report-btn"
                onClick={() => setShowReport(false)}
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsLayout;
