
import React, { useState } from 'react';
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

  const handleFeedback = (consultation) => {
    if (consultation.reviewGiven) {
      alert('You have already submitted a review.');
      return;
    }

    setSelectedDoctor(consultation);
    setRating(0);
    setFeedback('');
  };

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
              feedback
            }
          : item
      )
    );

    setSelectedDoctor(null);
    setRating(0);
    setFeedback('');

    alert('Your review has been submitted successfully!');
  };

  return (
    <div className="reviews-container">
      <h2>Reviews</h2>

      <table className="reviews-table">
        <thead>
          <tr>
            <th>Serial Number</th>
            <th>Doctor Name</th>
            <th>Doctor Speciality</th>
            <th>Provide feedback</th>
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
                  className="feedback-button"
                  onClick={() => handleFeedback(consultation)}
                  disabled={consultation.reviewGiven}
                >
                  {consultation.reviewGiven ? 'Reviewed' : 'Click Here'}
                </button>
              </td>
              <td>
                {consultation.reviewGiven ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDoctor && (
        <div className="review-form">
          <h3>Provide Feedback</h3>

          <p>
            Doctor: <strong>{selectedDoctor.doctorName}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <label>Rate your consultation:</label>

            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? 'active-star' : ''}
                >
                  ★
                </span>
              ))}
            </div>

            <label htmlFor="feedback">Your Feedback:</label>

            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows="4"
              required
            />

            <button type="submit" className="submit-review-button">
              Submit Review
            </button>

            <button
              type="button"
              className="cancel-review-button"
              onClick={() => setSelectedDoctor(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
