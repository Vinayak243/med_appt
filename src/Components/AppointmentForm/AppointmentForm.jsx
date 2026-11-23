
import React, { useState } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({
  doctorName,
  doctorSpeciality,
  onSubmit
}) => {
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const today = new Date().toLocaleDateString('en-CA');

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const appointmentDetails = {
      id: Date.now(),
      name: patientName,
      phoneNumber: phoneNumber,
      appointmentDate: appointmentDate,
      timeSlot: selectedSlot,
      doctorName,
      doctorSpeciality
    };

    if (onSubmit) {
      onSubmit(appointmentDetails);
    }

    setPatientName('');
    setPhoneNumber('');
    setAppointmentDate('');
    setSelectedSlot('');
  };

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

        {/* Patient name */}
        <div className="form-group">
          <label htmlFor="patientName">Patient Name</label>

          <input
            type="text"
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Phone number */}
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>

          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter 10-digit phone number"
            pattern="[0-9]{10}"
            maxLength="10"
            required
          />
        </div>

        {/* Appointment date */}
        <div className="form-group">
          <label htmlFor="appointmentDate">
            Appointment Date
          </label>

          <input
            type="date"
            id="appointmentDate"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={today}
            required
          />
        </div>

        {/* Appointment time slots */}
        <div className="form-group">
          <label htmlFor="timeSlot">
            Select Time Slot
          </label>

          <select
            id="timeSlot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            required
          >
            <option value="">Select a time slot</option>

            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="appointment-submit-btn"
        >
          Book Appointment
        </button>

      </form>
    </div>
  );
};

export default AppointmentForm;
