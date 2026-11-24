
import React, { useState, useEffect } from 'react';

import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import Notification from './Components/Notification/Notification';
import DoctorCard from './Components/DoctorCard/DoctorCard';
import BookingConsultation from './Components/BookingConsultation/BookingConsultation';
import InstantConsultation from './Components/InstantConsultationBooking/InstantConsultation';
import SignUp from './Sign_Up/SignUp';
import Login from './Login/Login';
import ReviewForm from './Components/ReviewForm/ReviewForm';
import MyAppointments from './Components/MyAppointments/MyAppointments';
import ProfileCard from './Components/ProfileCard/ProfileCard';
import ReportsLayout from './Components/ReportsLayout/ReportsLayout';

import { API_URL } from './config';
import './App.css';


// HOME PAGE
function Home() {
  return (
    <div className="home-page">

      <section className="home-hero">

        <div className="home-content">

          <p className="home-tagline">
            YOUR HEALTH, OUR PRIORITY
          </p>

          <h1>
            Find Your Doctor
            <br />
            Book Your Appointment
          </h1>

          <p>
            Take care of your health with trusted doctors and
            convenient online appointment booking.
          </p>

          <Link to="/doctors" className="home-book-btn">
            Find a Doctor
          </Link>

        </div>

        <div className="home-image">

          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600"
            alt="Healthcare professional"
          />

          <Link to="/reviews" className="floating-review-btn">
            <span>★</span> Reviews
          </Link>

        </div>

      </section>

      <section className="home-services">

        <h2>Why Choose StayHealthy?</h2>

        <div className="service-list">

          <div className="service-card">
            <h3>Verified Doctors</h3>
            <p>Connect with experienced healthcare professionals.</p>
          </div>

          <div className="service-card">
            <h3>Easy Booking</h3>
            <p>Book your appointments conveniently online.</p>
          </div>

          <div className="service-card">
            <h3>Instant Consultation</h3>
            <p>Get convenient access to healthcare consultations.</p>
          </div>

        </div>

      </section>

    </div>
  );
}


// MAIN APPLICATION
function App() {

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);


  // FETCH LOGGED-IN USER
  useEffect(() => {

    const fetchUser = async () => {

      const token = sessionStorage.getItem('auth-token');
      const email = sessionStorage.getItem('email');

      if (!token || !email) {
        setUser(null);
        return;
      }

      try {

        const response = await fetch(
          `${API_URL}/api/auth/user`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'email': email
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            data.message ||
            'Unable to fetch user profile.'
          );
        }

        setUser(data.user || data);

      } catch (error) {

        console.error('Profile fetching error:', error);
        setUser(null);

        // Do not automatically delete a token for temporary errors.
      }

    };

    fetchUser();

  }, [location.pathname]);


  // LOGOUT
  const handleLogout = () => {

    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('email');

    setUser(null);
    setDropdownOpen(false);

    navigate('/login', { replace: true });

  };


  return (

    <div className="App">

      <Notification>

        {/* NAVIGATION BAR */}

        <nav className="main-navbar">

          <Link
            to="/"
            className="nav-logo"
            onClick={() => setDropdownOpen(false)}
          >
            StayHealthy<span>.</span>
          </Link>


          <div className="nav-links">

            <Link
              to="/"
              onClick={() => setDropdownOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/doctors"
              onClick={() => setDropdownOpen(false)}
            >
              Doctors
            </Link>

            <Link
              to="/booking-consultation"
              onClick={() => setDropdownOpen(false)}
            >
              Appointments
            </Link>


            {user && (
              <Link
                to="/my-appointments"
                onClick={() => setDropdownOpen(false)}
              >
                My Appointments
              </Link>
            )}


            {/* LOGIN AND SIGNUP */}

            {!user ? (

              <>
                <Link to="/signup">Sign Up</Link>
                <Link to="/login">Login</Link>
              </>

            ) : (

              /* SINGLE PROFILE DROPDOWN */

              <div className="profile-dropdown">

                {/* WELCOME BUTTON */}

                <button
                  type="button"
                  className="welcome-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >

                  <span className="user-icon">
                    ♙
                  </span>

                  <span>
                    Welcome, {user.name || 'User'}
                  </span>

                  <span className="dropdown-arrow">
                    {dropdownOpen ? '▲' : '▼'}
                  </span>

                </button>


                {/* DROPDOWN OPTIONS */}

                {dropdownOpen && (

                  <div className="dropdown-menu">

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/profile');
                      }}
                    >
                      <span>♙</span>
                      Your Profile
                    </button>


                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/reports');
                      }}
                    >
                      <span>▤</span>
                      Your Reports
                    </button>


                    <button
                      type="button"
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      <span>↪</span>
                      Logout
                    </button>

                  </div>

                )}

              </div>

            )}


            {/* INSTANT CONSULTATION */}

            <Link
              to="/instant-consultation"
              className="nav-book-btn"
              onClick={() => setDropdownOpen(false)}
            >
              Instant Consultation
            </Link>

          </div>

        </nav>


        {/* APPLICATION ROUTES */}

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/doctors" element={<DoctorCard />} />

          <Route
            path="/my-appointments"
            element={<MyAppointments />}
          />

          <Route
            path="/reports"
            element={<ReportsLayout />}
          />

          <Route
            path="/booking-consultation"
            element={<BookingConsultation />}
          />

          <Route
            path="/instant-consultation"
            element={<InstantConsultation />}
          />

          <Route path="/reviews" element={<ReviewForm />} />

          <Route path="/signup" element={<SignUp />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/profile"
            element={
              <ProfileCard
                user={user}
                onUserUpdated={setUser}
                onClose={() => navigate('/')}
              />
            }
          />

        </Routes>

      </Notification>

    </div>
  );
}

export default App;
q