
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Notification.css';

const STORAGE_KEY = 'appointments';

// Remove duplicate appointment records
const getAppointments = (email) => {
    try {
        const storedAppointments = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        );

        const userAppointments = storedAppointments.filter(
            appointment =>
                appointment.status !== 'Cancelled' &&
                appointment.bookedBy === email
        );

        const uniqueAppointments = new Map();

        userAppointments.forEach(appointment => {
            const uniqueKey = [
                appointment.bookedBy,
                appointment.doctorName,
                appointment.appointmentDate,
                appointment.timeSlot,
                appointment.bookingType || 'regular'
            ].join('|').toLowerCase();

            if (!uniqueAppointments.has(uniqueKey)) {
                uniqueAppointments.set(uniqueKey, appointment);
            }
        });

        return Array.from(uniqueAppointments.values());

    } catch (error) {
        console.error('Unable to load appointments:', error);
        return [];
    }
};

const Notification = ({ children }) => {
    const location = useLocation();

    const [email, setEmail] = useState(
        sessionStorage.getItem('email')
    );

    const [appointments, setAppointments] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const loggedIn = !!(
        sessionStorage.getItem('auth-token') && email
    );

    const loadNotifications = () => {
        const currentEmail = sessionStorage.getItem('email');
        setEmail(currentEmail);

        if (
            !currentEmail ||
            !sessionStorage.getItem('auth-token')
        ) {
            setAppointments([]);
            setIsOpen(false);
            return;
        }

        setAppointments(getAppointments(currentEmail));
    };

    useEffect(() => {
        loadNotifications();

        const handleUpdate = () => {
            loadNotifications();
        };

        const events = [
            'appointmentsUpdated',
            'appointmentBooked',
            'appointmentCancelled',
            'storage',
            'userLoggedIn',
            'userLoggedOut'
        ];

        events.forEach(event =>
            window.addEventListener(event, handleUpdate)
        );

        return () => {
            events.forEach(event =>
                window.removeEventListener(event, handleUpdate)
            );
        };
    }, []);

    useEffect(() => {
        loadNotifications();
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <div className="notification-wrapper">

            {children}

            {loggedIn && (
                <div className="notification-container">

                    <button
                        type="button"
                        className="notification-bell"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="View notifications"
                        aria-expanded={isOpen}
                    >
                        <span className="bell-icon">🔔</span>

                        {appointments.length > 0 && (
                            <span className="notification-count">
                                {appointments.length > 99
                                    ? '99+'
                                    : appointments.length}
                            </span>
                        )}
                    </button>

                    {isOpen && (
                        <div className="notification-dropdown">

                            <div className="notification-title">
                                <h3>Notifications</h3>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close notifications"
                                >
                                    ×
                                </button>
                            </div>

                            {appointments.length === 0 ? (
                                <div className="no-notifications">
                                    <span>🔔</span>
                                    <p>No appointment notifications yet.</p>
                                    <small>
                                        Book an appointment to receive notifications.
                                    </small>
                                </div>
                            ) : (
                                <div className="notification-list">

                                    {appointments.map(appointment => (
                                        <div
                                            className="notification-item"
                                            key={appointment.id}
                                        >
                                            <div className="notification-item-icon">
                                                <span>📅</span>
                                            </div>

                                            <div className="notification-item-content">

                                                <strong>
                                                    Appointment booked successfully!
                                                </strong>

                                                <p>
                                                    Doctor: {appointment.doctorName || 'Doctor'}
                                                </p>

                                                <p>
                                                    Speciality: {appointment.doctorSpeciality || 'Not specified'}
                                                </p>

                                                <p>
                                                    Date: {appointment.appointmentDate || 'Not specified'}
                                                </p>

                                                <p>
                                                    Time: {appointment.timeSlot || 'Not specified'}
                                                </p>

                                                <span className="booking-status">
                                                    {appointment.status || 'Confirmed'}
                                                </span>

                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}

                        </div>
                    )}

                </div>
            )}

        </div>
    );
};

export default Notification;
