
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ReviewForm.css';

const GiveReviews = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        doctorName = '',
        doctorSpeciality = '',
        doctorId
    } = location.state || {};

    const [name, setName] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (submitted) return;

        if (rating === 0) {
            setMessage('Please select a star rating.');
            return;
        }

        const reviewData = {
            name: name.trim(),
            review: review.trim(),
            rating,
            doctorName,
            doctorSpeciality,
            doctorId
        };

        // Save the submitted review for this browser session
        const savedReviews = JSON.parse(
            sessionStorage.getItem('doctorReviews') || '[]'
        );

        savedReviews.push(reviewData);

        sessionStorage.setItem(
            'doctorReviews',
            JSON.stringify(savedReviews)
        );

        setSubmitted(true);
        setMessage('Your review has been submitted successfully!');
    };

    return (
        <div className="reviews-container">
            <div className="review-modal">
                <div className="review-modal-header">
                    <h2>Give Your Review</h2>
                </div>

                <div className="review-modal-body">
                    {doctorName && (
                        <p className="review-doctor-name">
                            Doctor: <strong>{doctorName}</strong>
                        </p>
                    )}

                    {doctorSpeciality && (
                        <p>
                            Speciality: <strong>{doctorSpeciality}</strong>
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="reviewerName">Name:</label>
                            <input
                                id="reviewerName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                                disabled={submitted}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewText">Review:</label>
                            <textarea
                                id="reviewText"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Write your review here..."
                                rows="4"
                                required
                                disabled={submitted}
                            />
                        </div>

                        <p className="review-rating-label">
                            Rate your experience:
                        </p>

                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={
                                        star <= rating ? 'active-star' : ''
                                    }
                                    onClick={() => setRating(star)}
                                    disabled={submitted}
                                    aria-label={`${star} stars`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        {message && (
                            <p className="auth-message" role="status">
                                {message}
                            </p>
                        )}

                        <div className="review-modal-actions">
                            <button
                                type="submit"
                                className="submit-review-button"
                                disabled={submitted}
                            >
                                {submitted ? 'Review Submitted' : 'Submit Review'}
                            </button>

                            <button
                                type="button"
                                className="cancel-review-button"
                                onClick={() => navigate('/reviews')}
                            >
                                Back to Reviews
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GiveReviews;
