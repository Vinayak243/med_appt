
import React, { useState, useRef, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './DoctorCardIC.css';
import AppointmentFormIC from '../AppointmentFormIC/AppointmentFormIC';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'appointments';

// Read appointments from localStorage
const getStoredAppointments = () => {
    try {
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Unable to load appointments:', error);
        return [];
    }
};

// Generate a consistent key for identifying the same booking
const getAppointmentKey = (appointment) => {
    return [
        appointment.bookedBy || '',
        appointment.doctorName || '',
        appointment.appointmentDate || '',
        appointment.timeSlot || '',
        appointment.bookingType || 'regular'
    ].join('|').toLowerCase();
};

// Get unique active appointments for one doctor and user
const getDoctorAppointments = (doctorName, email) => {
    if (!email) return [];

    const allAppointments = getStoredAppointments();

    const doctorAppointments = allAppointments.filter(
        appointment =>
            appointment.doctorName === doctorName &&
            appointment.bookingType === 'instant' &&
            appointment.status !== 'Cancelled' &&
            appointment.bookedBy === email
    );

    const uniqueAppointments = new Map();

    doctorAppointments.forEach(appointment => {
        const key = getAppointmentKey(appointment);

        if (!uniqueAppointments.has(key)) {
            uniqueAppointments.set(key, appointment);
        }
    });

    return Array.from(uniqueAppointments.values());
};

const DoctorCardIC = ({
    name,
    speciality,
    experience,
    ratings,
    profilePic
}) => {
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const bookingInProgress = useRef(false);

    // Refresh appointments for this doctor
    const refreshAppointments = () => {
        const email = sessionStorage.getItem('email');

        setAppointments(
            getDoctorAppointments(name, email)
        );
    };

    // Listen for appointment changes
    useEffect(() => {
        const handleUpdate = () => {
            refreshAppointments();
        };

        handleUpdate();

        const events = [
            'appointmentsUpdated',
            'appointmentBooked',
            'appointmentCancelled',
            'userLoggedIn',
            'userLoggedOut'
        ];

        events.forEach(event => {
            window.addEventListener(event, handleUpdate);
        });

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleUpdate);
            });
        };
    }, [name]);

    // Open appointment popup
    const handleBooking = () => {
        refreshAppointments();
        setShowModal(true);
    };

    // Cancel appointment and remove duplicate copies
    const handleCancel = (appointmentId) => {
        const allAppointments = getStoredAppointments();

        const selectedAppointment = allAppointments.find(
            appointment =>
                appointment.id === appointmentId
        );

        if (!selectedAppointment) {
            refreshAppointments();
            return;
        }

        const selectedKey = getAppointmentKey(
            selectedAppointment
        );

        // Remove all copies of this same booking
        const updatedAppointments = allAppointments.filter(
            appointment =>
                getAppointmentKey(appointment) !== selectedKey
        );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedAppointments)
        );

        // Clean legacy doctor-specific appointment data
        try {
            const storedAppointment = JSON.parse(
                localStorage.getItem(name) || 'null'
            );

            if (
                storedAppointment &&
                getAppointmentKey(storedAppointment) === selectedKey
            ) {
                localStorage.removeItem(name);
            }

            const doctorData = JSON.parse(
                localStorage.getItem('doctorData') || 'null'
            );

            if (doctorData?.name === name) {
                localStorage.removeItem('doctorData');
            }
        } catch (error) {
            console.error(
                'Unable to clear old appointment data:',
                error
            );
        }

        refreshAppointments();
        setShowModal(false);

        window.dispatchEvent(
            new Event('appointmentCancelled')
        );

        window.dispatchEvent(
            new Event('appointmentsUpdated')
        );
    };

    // Submit a new appointment
    const handleFormSubmit = (appointmentData) => {
        if (bookingInProgress.current) return;

        bookingInProgress.current = true;

        try {
            const email = sessionStorage.getItem('email');
            const token = sessionStorage.getItem('auth-token');

            if (!email || !token) {
                alert('Please log in before booking an appointment.');
                return;
            }

            const newAppointment = {
                ...appointmentData,
                id: uuidv4(),
                doctorName: name,
                doctorSpeciality: speciality,
                experience,
                ratings,
                profilePic,
                bookedBy: email,
                bookingType: 'instant',
                status: 'Upcoming'
            };

            const existingAppointments = getStoredAppointments();

            const newKey = getAppointmentKey(newAppointment);

            // Avoid accidental duplicate active submissions.
            // A cancelled appointment does not block rebooking.
            const alreadyExists = existingAppointments.some(
                appointment =>
                    appointment.status !== 'Cancelled' &&
                    getAppointmentKey(appointment) === newKey
            );

            if (alreadyExists) {
                refreshAppointments();
                setShowModal(false);
                return;
            }

            const updatedAppointments = [
                ...existingAppointments,
                newAppointment
            ];

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedAppointments)
            );

            // Preserve existing doctor information
            localStorage.setItem(
                'doctorData',
                JSON.stringify({
                    name,
                    speciality,
                    experience,
                    ratings,
                    profilePic
                })
            );

            localStorage.setItem(
                name,
                JSON.stringify(newAppointment)
            );

            refreshAppointments();
            setShowModal(false);

            // Refresh notification component
            window.dispatchEvent(
                new Event('appointmentBooked')
            );

            window.dispatchEvent(
                new Event('appointmentsUpdated')
            );

        } catch (error) {
            console.error(
                'Appointment booking error:',
                error
            );

            alert('Unable to book appointment. Please try again.');

        } finally {
            bookingInProgress.current = false;
        }
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
                        appointments.length > 0
                            ? 'cancel-appointment'
                            : ''
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

                            {appointments.map(appointment => (
                                <div
                                    className="bookedInfo"
                                    key={appointment.id}
                                >

                                    <p>
                                        <strong>Name:</strong>{' '}
                                        {appointment.name}
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
                                        onClick={() =>
                                            handleCancel(appointment.id)
                                        }
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
