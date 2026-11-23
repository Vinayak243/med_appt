
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import './DoctorCard.css';
import AppointmentForm from '../AppointmentForm/AppointmentForm';

const STORAGE_KEY = 'appointments';

const doctors = [
  {
    id: 1,
    name: 'Dr. Jiao Yang',
    speciality: 'Dentist',
    experience: '9',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'Dr. Denis Raj',
    speciality: 'Dentist',
    experience: '24',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'Dr. Lyn Christie',
    speciality: 'Dentist',
    experience: '11',
    rating: 3,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
  }
];

const getAppointments = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const DoctorCardItem = ({ doctor }) => {
  const [appointments, setAppointments] = useState(() =>
    getAppointments().filter(
      appointment =>
        appointment.doctorName === doctor.name &&
        appointment.status !== 'Cancelled'
    )
  );

  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (details) => {
    const appointment = {
      id: Date.now(),
      name: details.name,
      phoneNumber: details.phoneNumber,
      appointmentDate: details.appointmentDate,
      timeSlot: details.timeSlot,
      doctorName: doctor.name,
      doctorSpeciality: doctor.speciality,
      doctorImage: doctor.image,
      status: 'Upcoming',
      reviewGiven: false
    };

    const allAppointments = getAppointments();

    const updatedAppointments = [
      ...allAppointments,
      appointment
    ];

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedAppointments)
    );

    // Preserve existing notification data
    localStorage.setItem(
      'doctorData',
      JSON.stringify({
        name: doctor.name,
        speciality: doctor.speciality,
        experience: doctor.experience,
        ratings: doctor.rating,
        profilePic: doctor.image
      })
    );

    localStorage.setItem(
      doctor.name,
      JSON.stringify(appointment)
    );

    setAppointments(previous => [...previous, appointment]);
    setShowModal(false);

    window.dispatchEvent(new Event('appointmentBooked'));
    window.dispatchEvent(new Event('appointmentsUpdated'));
  };

  const handleCancel = (appointmentId) => {
    const updatedAppointments = getAppointments().filter(
      appointment => appointment.id !== appointmentId
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedAppointments)
    );

    localStorage.removeItem(doctor.name);
    localStorage.removeItem('doctorData');

    setAppointments(updatedAppointments.filter(
      appointment => appointment.doctorName === doctor.name
    ));

    setShowModal(false);

    window.dispatchEvent(new Event('appointmentCancelled'));
    window.dispatchEvent(new Event('appointmentsUpdated'));
  };

  return (
    <div className="doctor-card">
      <div className="doctor-card-details-container">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="doctor-image"
        />

        <h3>{doctor.name}</h3>
        <p>{doctor.speciality}</p>

        <p className="doctor-experience">
          {doctor.experience} years experience
        </p>

        <div className="doctor-rating">
          <strong>Ratings:</strong>
          <span>{'★'.repeat(doctor.rating)}</span>
        </div>

        <div className="doctor-card-options-container">
          <button
            type="button"
            className="book-appointment-btn"
            onClick={() => setShowModal(true)}
          >
            {appointments.length > 0
              ? 'View Appointment'
              : 'Book Appointment'}

            <div>No Booking Fee</div>
          </button>

          <Popup
            open={showModal}
            modal
            closeOnDocumentClick
            onClose={() => setShowModal(false)}
          >
            <div className="doctorbg">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="doctor-image"
              />

              <div className="doctor-card-details">
                <h3>{doctor.name}</h3>
                <p>{doctor.speciality}</p>
                <p>{doctor.experience} years experience</p>
                <p>Ratings: {'★'.repeat(doctor.rating)}</p>
              </div>

              {appointments.length > 0 ? (
                <>
                  <h3 style={{ textAlign: 'center' }}>
                    Appointment Details
                  </h3>

                  {appointments.map(appointment => (
                    <div className="bookedInfo" key={appointment.id}>
                      <p><strong>Name:</strong> {appointment.name}</p>
                      <p><strong>Phone:</strong> {appointment.phoneNumber}</p>
                      <p><strong>Date:</strong> {appointment.appointmentDate}</p>
                      <p><strong>Time:</strong> {appointment.timeSlot}</p>

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
                <AppointmentForm
                  doctorName={doctor.name}
                  doctorSpeciality={doctor.speciality}
                  onSubmit={handleFormSubmit}
                />
              )}
            </div>
          </Popup>
        </div>
      </div>
    </div>
  );
};

const DoctorCard = () => {
  return (
    <div className="doctor-card-page">
      <h2>{doctors.length} doctors available</h2>

      <h3>
        Book appointments with minimum wait-time & verified doctor details
      </h3>

      <div className="doctor-card-list">
        {doctors.map(doctor => (
          <DoctorCardItem key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorCard;
