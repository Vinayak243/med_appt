
import React from 'react';
import './ReportsLayout.css';

const ReportsLayout = () => {
  return (
    <div className="reports-container">

      <h2>My Medical Reports</h2>

      <p>View and download your medical reports.</p>

      <div className="report-card">

        <div className="report-icon">
          📄
        </div>

        <div className="report-details">
          <h3>Patient Medical Report</h3>
          <p>patient_report.pdf</p>
        </div>

        <div className="report-actions">

          <a
            href="/patient_report.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="view-report-btn"
          >
            View Report
          </a>

          <a
            href="/patient_report.pdf"
            download="patient_report.pdf"
            className="download-report-btn"
          >
            Download Report
          </a>

        </div>

      </div>

    </div>
  );
};

export default ReportsLayout;
