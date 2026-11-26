
import React, { useState, useEffect } from 'react';
import './ReviewForm.css';

const ReviewForm = () => {
    const [consultations, setConsultations] = useState([
        {
            id: 1,
            doctorName: 'Dr. John Doe',
            speciality: 'Cardiology',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        },
        {
            id: 2,
            doctorName: 'Dr. Jane Smith',
            speciality: 'Dermatology',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        },
        {
            id: 3,
            doctorName: 'Dr. Michael Brown',
            speciality: 'Neurology',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        },
        {
            id: 4,
            doctorName: 'Dr. Sarah Wilson',
            speciality: 'Pediatrics',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        },
        {
            id: 5,
            doctorName: 'Dr. David Miller',
            speciality: 'Orthopedics',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        },
        {
            id: 6,
            doctorName: 'Dr. Emily Davis',
            speciality: 'Gynecology',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        },
        {
            id: 7,
            doctorName: 'Dr. Robert Taylor',
            speciality: 'Ophthalmology',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        },
        {
            id: 8,
            doctorName: 'Dr. Olivia Martin',
            speciality: 'Psychiatry',
            reviewGiven: false,
            rating: 0,
            feedback: ''
        }
    ]);

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    // Close popup using Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setSelectedDoctor(null);
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, []);

    // Open feedback popup
    const handleFeedback = (consultation) => {
        if (consultation.reviewGiven) {
            alert('You have already submitted a review.');
            return;
        }

        setSelectedDoctor(consultation);
        setRating(0);
        setFeedback('');
    };

    // Close popup
    const handleClose = () => {
        setSelectedDoctor(null);
        setRating(0);
        setFeedback('');
    };

    // Submit review
    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a star rating.');
            return;
        }

        if (!feedback.trim()) {
            alert('Please enter your feedback.');
            return;
        }

        setConsultations((previous) =>
            previous.map((item) =>
                item.id === selectedDoctor.id
                    ? {
                        ...item,
                        reviewGiven: true,
                        rating,
                        feedback: feedback.trim()
                    }
                    : item
            )
        );

        handleClose();

        alert('Your review has been submitted successfully!');
    };

    return (
        <div className="reviews-container">

            <h2>Reviews</h2>

            {/* Doctors Table */}
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
                                        onClick={() => handleFeedback(consultation)}
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

            {/* Centered Feedback Popup */}
            {selectedDoctor && (
                <div
                    className="review-modal-overlay"
                    onClick={handleClose}
                >
                    <div
                        className="review-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="review-modal-title"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="review-modal-header">

                            <h3 id="review-modal-title">
                                Provide Feedback
                            </h3>

                            <button
                                type="button"
                                className="review-modal-close"
                                onClick={handleClose}
                                aria-label="Close feedback form"
                            >
                                ×
                            </button>

                        </div>

                        <div className="review-modal-body">

                            <p className="review-doctor-name">
                                Doctor:{' '}
                                <strong>
                                    {selectedDoctor.doctorName}
                                </strong>
                            </p>

                            <p className="review-rating-label">
                                Rate your consultation:
                            </p>

                            {/* Star Rating */}
                            <div
                                className="star-rating"
                                role="group"
                                aria-label="Select rating from one to five stars"
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={
                                            star <= rating
                                                ? 'active-star'
                                                : ''
                                        }
                                        onClick={() => setRating(star)}
                                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                        aria-pressed={rating === star}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            {/* Feedback Form */}
                            <form onSubmit={handleSubmit}>

                                <label htmlFor="feedback">
                                    Your Feedback:
                                </label>

                                <textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) =>
                                        setFeedback(e.target.value)
                                    }
                                    placeholder="Write your feedback here..."
                                    rows="4"
                                    required
                                />

                                <div className="review-modal-actions">

                                    <button
                                        type="submit"
                                        className="submit-review-button"
                                    >
                                        Submit Review
                                    </button>

                                    <button
                                        type="button"
                                        className="cancel-review-button"
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ReviewForm;
