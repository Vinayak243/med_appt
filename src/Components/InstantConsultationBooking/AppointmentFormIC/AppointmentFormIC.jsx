
import React, { useState } from 'react';

const AppointmentFormIC = ({
    doctorName,
    doctorSpeciality,
    onSubmit
}) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const appointmentData = {
            name,
            phoneNumber,
            doctorName,
            doctorSpeciality
        };

        // Submit the form only once
        onSubmit(appointmentData);

        // Reset form fields
        setName('');
        setPhoneNumber('');
    };

    return (
        <form onSubmit={handleFormSubmit} className="appointment-form">

            {/* Patient Name */}
            <div className="form-group">
                <label htmlFor="name">Patient Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
            </div>

            {/* Phone Number */}
            <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                />
            </div>

            <button type="submit">Book Now</button>

        </form>
    );
};

export default AppointmentFormIC;
