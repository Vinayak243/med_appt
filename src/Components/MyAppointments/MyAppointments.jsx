
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyAppointments.css';

const STORAGE_KEY = 'appointments';

const getAppointmentStatus = (appointment) => {
  const appointmentDate = appointment.appointmentDate;
  const appointmentTime = appointment.timeSlot;

  if (!appointmentDate || !appointmentTime) {
    return 'Upcoming';
  }

  const match = appointmentTime.match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!match) {
    return 'Upcoming';
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const appointmentDateTime = new Date(
    `${appointmentDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  );

  return new Date() >= appointmentDateTime
    ? 'Completed'
    : 'Upcoming';
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = () => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );

      const updated = stored.map(appointment => {
        if (appointment.status === 'Cancelled') {
          return appointment;
        }

        return {
          ...appointment,
          status: getAppointmentStatus(appointment)
        };
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setAppointments(
        updated.filter(appointment => appointment.status !== 'Cancelled')
      );
    } catch (error) {
      console.error('Unable to load appointments:', error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    loadAppointments();

    window.addEventListener('appointmentsUpdated', loadAppointments);

    const interval = setInterval(loadAppointments, 60000);

    return () => {
      window.removeEventListener('appointmentsUpdated', loadAppointments);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="my-appointments-container">
      <h2>My Appointments</h2>
      <p className="appointments-subtitle">
        View your consultations and share your feedback.
      </p>

      {appointments.length === 0 ? (
        <div className="no-appointments">
          <h3>No appointments found</h3>
          <p>Book a consultation to see your appointments here.</p>
          <Link to="/doctors" className="appointment-action">
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="my-appointments-list">
          {appointments.map(appointment => (
            <div className="my-appointment-card" key={appointment.id}>
              <div className="appointment-info">
                {appointment.doctorImage && (
                  <img
                    src={appointment.doctorImage}
                    alt={appointment.doctorName}
                  />
                )}

                <div>
                  <h3>{appointment.doctorName}</h3>
                  <p>{appointment.doctorSpeciality}</p>
                  <p>Patient: {appointment.name}</p>
                  <p>Date: {appointment.appointmentDate}</p>
                  <p>Time: {appointment.timeSlot}</p>
                </div>
              </div>

              <div className="appointment-actions">
                <span
                  className={
                    appointment.status === 'Completed'
                      ? 'appointment-status completed'
                      : 'appointment-status upcoming'
                  }
                >
                  {appointment.status}
                </span>

                {appointment.status === 'Completed' && (
                  appointment.reviewGiven ? (
                    <span className="review-submitted">
                      Review submitted
                    </span>
                  ) : (
                    <Link
                      to="/reviews"
                      state={{ appointment }}
                      className="write-review-button"
                    >
                      ★ Write a Review
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
