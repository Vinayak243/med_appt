
import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [appointmentData, setAppointmentData] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Load appointment details from localStorage
    const loadAppointment = () => {
        try {
            const storedUsername = sessionStorage.getItem('email');

            const storedDoctorData = JSON.parse(
                localStorage.getItem('doctorData') || 'null'
            );

            const storedAppointmentData = storedDoctorData?.name
                ? JSON.parse(
                    localStorage.getItem(storedDoctorData.name) || 'null'
                )
                : null;

            setIsLoggedIn(!!storedUsername);
            setAppointmentData(storedAppointmentData);

            setShowNotification(
                !!storedUsername && !!storedAppointmentData
            );
        } catch (error) {
            console.error('Notification loading error:', error);
            setAppointmentData(null);
            setShowNotification(false);
        }
    };

    useEffect(() => {
        // Load notification initially
        loadAppointment();

        // Listen for successful booking
        const handleBooking = () => {
            loadAppointment();
        };

        // Listen for appointment cancellation
        const handleCancellation = () => {
            setAppointmentData(null);
            setShowNotification(false);
            setShowDetails(false);
        };

        window.addEventListener('appointmentBooked', handleBooking);

        window.addEventListener(
            'appointmentCancelled',
            handleCancellation
        );

        // Clean up event listeners
        return () => {
            window.removeEventListener('appointmentBooked', handleBooking);

            window.removeEventListener(
                'appointmentCancelled',
                handleCancellation
            );
        };
    }, []);

    return (
        <div className="notification-wrapper">

            {children}

            {/* Appointment notification */}
            {isLoggedIn && showNotification && appointmentData && (
                <div
                    className="appointment-notification"
                    onClick={() => setShowDetails(!showDetails)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setShowDetails(!showDetails);
                        }
                    }}
                >
                    <h2>Appointment Details</h2>

                    <p>
                        <strong>Doctor:</strong>{' '}
                        {appointmentData.doctorName}
                    </p>

                    <p>
                        <strong>Speciality:</strong>{' '}
                        {appointmentData.doctorSpeciality}
                    </p>

                    <p>
                        <strong>Name:</strong>{' '}
                        {appointmentData.name}
                    </p>

                    <p>
                        <strong>Phone Number:</strong>{' '}
                        {appointmentData.phoneNumber}
                    </p>

                    <p>
                        <strong>Date of Appointment:</strong>{' '}
                        {appointmentData.appointmentDate}
                    </p>

                    <p>
                        <strong>Time Slot:</strong>{' '}
                        {appointmentData.timeSlot}
                    </p>

                    <p className="notification-hint">
                        Click to {showDetails ? 'hide' : 'view'} appointment details
                    </p>

                    {showDetails && (
                        <div className="appointment-extra-details">
                            <h3>Booking Confirmed!</h3>
                            <p>Your appointment has been successfully booked.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
