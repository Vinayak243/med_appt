
import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

import './DoctorCard.css'
import AppointmentForm from '../AppointmentForm/AppointmentForm'

const doctors = [
  {
    id: 1,
    name: 'Dr. Jiao Yang',
    speciality: 'Dentist',
    experience: '9',
    rating: 5,
    image: '/images/doctor1.png'
  },
  {
    id: 2,
    name: 'Dr. Denis Raj',
    speciality: 'Dentist',
    experience: '24',
    rating: 4,
    image: '/images/doctor2.png'
  },
  {
    id: 3,
    name: 'Dr. Lyn Christie',
    speciality: 'Dentist',
    experience: '11',
    rating: 3,
    image: ''
  }
]

const DoctorCardItem = ({ doctor }) => {
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)

  const handleFormSubmit = (details) => {
    const appointment = {
      id: Date.now(),
      name: details.name,
      phoneNumber: details.phoneNumber
    }

    setAppointments([appointment])
    setShowModal(false)
  }

  const handleCancel = (appointmentId) => {
    setAppointments((previousAppointments) =>
      previousAppointments.filter(
        (appointment) => appointment.id !== appointmentId
      )
    )

    setShowModal(false)
  }

  return (
    <div className="doctor-card">

      <div className="doctor-card-details-container">

        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="doctor-image"
          />
        ) : (
          <div className="doctor-placeholder">
            <i className="fa fa-user-md"></i>
          </div>
        )}

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

          <Popup
            trigger={
              <button
                className={`book-appointment-btn ${
                  appointments.length > 0 ? 'cancel-appointment' : ''
                }`}
              >
                {appointments.length > 0 ? (
                  <div>Cancel Appointment</div>
                ) : (
                  <div>Book Appointment</div>
                )}

                <div>No Booking Fee</div>
              </button>
            }
            modal
            open={showModal}
            onOpen={() => setShowModal(true)}
            onClose={() => setShowModal(false)}
          >
            {(close) => (
              <div className="doctorbg">

                <div className="doctor-card-profile-image-container">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="doctor-image"
                    />
                  ) : (
                    <i className="fa fa-user-md"></i>
                  )}
                </div>

                <div className="doctor-card-details">
                  <div className="doctor-card-detail-name">
                    {doctor.name}
                  </div>

                  <div className="doctor-card-detail-speciality">
                    {doctor.speciality}
                  </div>

                  <div className="doctor-card-detail-experience">
                    {doctor.experience} years experience
                  </div>

                  <div className="doctor-card-detail-consultationfees">
                    Ratings: {'★'.repeat(doctor.rating)}
                  </div>
                </div>

                {appointments.length > 0 ? (
                  <>
                    <h3 style={{ textAlign: 'center' }}>
                      Appointment Booked!
                    </h3>

                    {appointments.map((appointment) => (
                      <div className="bookedInfo" key={appointment.id}>
                        <p>Name: {appointment.name}</p>

                        <p>
                          Phone Number: {appointment.phoneNumber}
                        </p>

                        <button
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
            )}
          </Popup>

        </div>

      </div>
    </div>
  )
}

const DoctorCard = () => {
  return (
    <div className="doctor-card-page">

      <h2>{doctors.length} doctors available</h2>

      <h3>
        Book appointments with minimum wait-time & verified doctor details
      </h3>

      <div className="doctor-card-list">
        {doctors.map((doctor) => (
          <DoctorCardItem
            key={doctor.id}
            doctor={doctor}
          />
        ))}
      </div>

    </div>
  )
}

export default DoctorCard
