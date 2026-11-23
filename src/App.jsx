
import { Routes, Route, Link } from 'react-router-dom';

import Notification from './Components/Notification/Notification';
import DoctorCard from './Components/DoctorCard/DoctorCard';
import BookingConsultation from './Components/BookingConsultation/BookingConsultation';
import InstantConsultation from './Components/InstantConsultationBooking/InstantConsultation';
import SignUp from './Sign_Up/SignUp';
import Login from './Login/Login';
import ReviewForm from './Components/ReviewForm/ReviewForm';
import MyAppointments from './Components/MyAppointments/MyAppointments';
import './App.css';

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-content">
          <p className="home-tagline">YOUR HEALTH, OUR PRIORITY</p>

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

function App() {
  return (
    <div className="App">
      <Notification>
        {/* Navigation bar */}
        <nav className="main-navbar">
          <Link to="/" className="nav-logo">
            StayHealthy<span>.</span>
          </Link>

          <div className="nav-links">
  <Link to="/">Home</Link>
  <Link to="/doctors">Doctors</Link>
  <Link to="/booking-consultation">Appointments</Link>
  
  {/* <Link to="/my-appointments">My Appointments</Link> */}
  <Link to="/signup">Sign Up</Link>
  <Link to="/login">Login</Link>

  <Link to="/instant-consultation" className="nav-book-btn">
    Instant Consultation
  </Link>
</div>
        </nav>

        {/* Application routes */}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/doctors" element={<DoctorCard />} />
          <Route
  path="/my-appointments"
  element={<MyAppointments />}
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
        </Routes>
      </Notification>
    </div>
  );
}

export default App;
