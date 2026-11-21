
import React, { useState } from 'react'
import './AppointmentForm.css'

const AppointmentForm = ({
  doctorName,
  doctorSpeciality,
  onSubmit
}) => {
  const [patientName, setPatientName] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const appointmentDetails = {
      id: Date.now(),
      name: patientName,
      phoneNumber: '',
      patientName,
      appointmentDate,
      appointmentTime,
      doctorName,
      doctorSpeciality
    }

    if (onSubmit) {
      onSubmit(appointmentDetails)
    }

    setPatientName('')
    setAppointmentDate('')
    setAppointmentTime('')
  }

  return (
    <div className="appointment-form-container">

      <h2>Book Your Appointment</h2>

      <div className="appointment-doctor-details">
        <p><strong>Doctor:</strong> {doctorName}</p>
        <p><strong>Speciality:</strong> {doctorSpeciality}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="appointment-form"
      >

        <div className="form-group">
          <label htmlFor="patientName">
            Patient Name
          </label>

          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentDate">
            Appointment Date
          </label>

          <input
            type="date"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentTime">
            Appointment Time
          </label>

          <input
            type="time"
            id="appointmentTime"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="appointment-submit-btn"
        >
          Book Appointment
        </button>

      </form>
    </div>
  )
}

export default AppointmentForm
