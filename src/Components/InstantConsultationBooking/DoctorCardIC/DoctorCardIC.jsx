
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';

const DoctorCardIC = ({
  name,
  speciality,
  experience,
  ratings,
  profilePic
}) => {
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // Open booking popup
  const handleBooking = () => {
    setShowModal(true);
  };

  // Cancel appointment
  const handleCancel = (appointmentId) => {
    const remainingAppointments = appointments.filter(
      appointment => appointment.id !== appointmentId
    );

    setAppointments(remainingAppointments);

    // Remove appointment data from localStorage
    localStorage.removeItem('doctorData');
    localStorage.removeItem(name);

    // Notify Notification component
    window.dispatchEvent(
      new Event('appointmentCancelled')
    );

    setShowModal(false);
  };

  // Save appointment after successful form submission
  const handleFormSubmit = (appointmentData) => {

    const newAppointment = {
      id: uuidv4(),
      ...appointmentData,
      doctorName: name,
      doctorSpeciality: speciality,
      experience: experience,
      ratings: ratings,
      profilePic: profilePic
    };

    // Update appointment state
    setAppointments([newAppointment]);

    // Save doctor information
    const doctorData = {
      name: name,
      speciality: speciality,
      experience: experience,
      ratings: ratings,
      profilePic: profilePic
    };

    localStorage.setItem(
      'doctorData',
      JSON.stringify(doctorData)
    );

    // Save complete appointment information
    localStorage.setItem(
      name,
      JSON.stringify(newAppointment)
    );

    // Close booking popup
    setShowModal(false);

    // Trigger notification
    window.dispatchEvent(
      new Event('appointmentBooked')
    );
  };

  // Doctor profile image
  const DoctorImage = () => (
    <div className="doctor-card-profile-image-container">
      {profilePic ? (
        <img
          src={profilePic}
          alt={name}
          className="doctor-profile-pic"
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="46"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0-6 3 3 0 0 0 0 6z" />
        </svg>
      )}
    </div>
  );

  return (
    <div className="doctor-card-container">

      {/* Doctor details */}
      <div className="doctor-card-details-container">

        <DoctorImage />

        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">
            {name}
          </div>

          <div className="doctor-card-detail-speciality">
            {speciality}
          </div>

          <div className="doctor-card-detail-experience">
            {experience} years experience
          </div>

          <div className="doctor-card-detail-consultationfees">
            Ratings: {ratings}
          </div>
        </div>

      </div>

      {/* Booking button */}
      <div className="doctor-card-options-container">

        <button
          type="button"
          onClick={handleBooking}
          className={`book-appointment-btn ${
            appointments.length > 0 ? 'cancel-appointment' : ''
          }`}
        >
          <div>
            {appointments.length > 0
              ? 'View Appointment'
              : 'Book Appointment'}
          </div>

          <div>No Booking Fee</div>
        </button>

      </div>

      {/* Appointment popup */}
      <Popup
        open={showModal}
        modal
        closeOnDocumentClick
        onClose={() => setShowModal(false)}
      >
        <div className="doctorbg">

          <DoctorImage />

          <div className="doctor-card-details">
            <div className="doctor-card-detail-name">
              {name}
            </div>

            <div className="doctor-card-detail-speciality">
              {speciality}
            </div>

            <div className="doctor-card-detail-experience">
              {experience} years experience
            </div>

            <div className="doctor-card-detail-consultationfees">
              Ratings: {ratings}
            </div>
          </div>

          {appointments.length > 0 ? (
            <>
              <h3 style={{ textAlign: 'center' }}>
                Appointment Booked!
              </h3>

              {appointments.map((appointment) => (
                <div className="bookedInfo" key={appointment.id}>

                  <p>
                    <strong>Name:</strong> {appointment.name}
                  </p>

                  <p>
                    <strong>Phone Number:</strong>{' '}
                    {appointment.phoneNumber}
                  </p>

                  <p>
                    <strong>Date of Appointment:</strong>{' '}
                    {appointment.appointmentDate}
                  </p>

                  <p>
                    <strong>Time Slot:</strong>{' '}
                    {appointment.timeSlot}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleCancel(appointment.id)}
                  >
                    Cancel Appointment
                  </button>

                </div>
              ))}
            </>
          ) : (
            <AppointmentFormIC
              doctorName={name}
              doctorSpeciality={speciality}
              onSubmit={handleFormSubmit}
            />
          )}

        </div>
      </Popup>

    </div>
  );
};

export default DoctorCardIC;
