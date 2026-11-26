
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReviewForm.css';


const initialConsultations = [
    { id: 1, doctorName: 'Dr. John Doe', speciality: 'Cardiology' },
    { id: 2, doctorName: 'Dr. Jane Smith', speciality: 'Dermatology' },
    { id: 3, doctorName: 'Dr. Michael Brown', speciality: 'Neurology' },
    { id: 4, doctorName: 'Dr. Sarah Wilson', speciality: 'Pediatrics' },
    { id: 5, doctorName: 'Dr. David Miller', speciality: 'Orthopedics' },
    { id: 6, doctorName: 'Dr. Emily Davis', speciality: 'Gynecology' },
    { id: 7, doctorName: 'Dr. Robert Taylor', speciality: 'Ophthalmology' },
    { id: 8, doctorName: 'Dr. Olivia Martin', speciality: 'Psychiatry' }
];

const ReviewForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [consultations, setConsultations] = useState(() => {
        return initialConsultations.map((doctor) => ({
            ...doctor,
            reviewGiven: false
        }));
    });

    // Read the submitted review when returning from GiveReviews
    useEffect(() => {
        const savedReviews = JSON.parse(
            sessionStorage.getItem('doctorReviews') || '[]'
        );

        setConsultations((previous) =>
            previous.map((doctor) => ({
                ...doctor,
                reviewGiven: savedReviews.some(
                    (review) =>
                        String(review.doctorId) === String(doctor.id)
                )
            }))
        );
    }, [location.pathname, location.key]);

    // Navigate to the separate Give Review page
    const handleFeedback = (consultation) => {
        if (consultation.reviewGiven) {
            return;
        }

        navigate('/give-review', {
            state: {
                doctorName: consultation.doctorName,
                doctorSpeciality: consultation.speciality,
                doctorId: consultation.id
            }
        });
    };

    return (
        <div className="reviews-container">

            <h2>Reviews</h2>

            <div className="reviews-table-wrapper">
                <table className="reviews-table">

                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Doctor Name</th>
                            <th>Doctor Speciality</th>
                            <th>Provide Feedback</th>
                            <th>Review Given</th>
                        </tr>
                    </thead>

                    <tbody>
                        {consultations.map((consultation) => (
                            <tr key={consultation.id}>

                                <td>{consultation.id}</td>

                                <td>{consultation.doctorName}</td>

                                <td>{consultation.speciality}</td>

                                <td>
                                    <button
                                        type="button"
                                        className="feedback-button"
                                        onClick={() =>
                                            handleFeedback(consultation)
                                        }
                                        disabled={consultation.reviewGiven}
                                    >
                                        {consultation.reviewGiven
                                            ? 'Reviewed'
                                            : 'Click Here'}
                                    </button>
                                </td>

                                <td>
                                    {consultation.reviewGiven ? 'Yes' : 'No'}
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default ReviewForm;
