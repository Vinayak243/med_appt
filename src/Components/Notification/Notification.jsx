
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Notification.css';

const Notification = ({ children }) => {
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [appointmentData, setAppointmentData] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Load appointment details
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
        loadAppointment();

        const handleBooking = () => {
            loadAppointment();
            setShowDetails(false);
        };

        const handleCancellation = () => {
            setAppointmentData(null);
            setShowNotification(false);
            setShowDetails(false);
        };

        window.addEventListener('appointmentBooked', handleBooking);
        window.addEventListener('appointmentCancelled', handleCancellation);

        return () => {
            window.removeEventListener('appointmentBooked', handleBooking);
            window.removeEventListener('appointmentCancelled', handleCancellation);
        };
    }, []);

    // Reload notification when navigating between pages
    useEffect(() => {
        if (location.pathname === '/') {
            loadAppointment();
        }
    }, [location.pathname]);

    // Show appointment panel only on Home page
    const shouldShowNotification =
    location.pathname === '/profile' &&
    isLoggedIn &&
    showNotification &&
    appointmentData;

    return (
        <div className="notification-wrapper">

            {children}

            {shouldShowNotification && (

                <div className="appointment-notification">

                    <div
                        className="notification-heading"
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        <h2>Appointment Details</h2>

                        <button
                            type="button"
                            className="notification-toggle"
                            aria-label="Toggle appointment details"
                        >
                            {showDetails ? '−' : '+'}
                        </button>
                    </div>

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
                        <strong>Date:</strong>{' '}
                        {appointmentData.appointmentDate}
                    </p>

                    <p>
                        <strong>Time:</strong>{' '}
                        {appointmentData.timeSlot}
                    </p>

                    {showDetails && (
                        <div className="appointment-extra-details">
                            <h3>Booking Confirmed!</h3>
                            <p>
                                Your appointment has been successfully booked.
                            </p>
                        </div>
                    )}

                    <button
                        type="button"
                        className="notification-close"
                        onClick={() => setShowNotification(false)}
                    >
                        Close
                    </button>

                </div>
            )}

        </div>
    );
};

export default Notification;
