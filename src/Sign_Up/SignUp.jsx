
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sign_Up.css';
import { API_URL } from '../config';

const SignUp = () => {
    const navigate = useNavigate();

    const initialFormData = {
        name: '',
        phone: '',
        email: '',
        password: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Reset form
    const handleReset = () => {
        setFormData(initialFormData);
        setMessage('');
    };

    // Handle registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const name = formData.name.trim();
        const phone = formData.phone.trim();
        const email = formData.email.trim();

        if (name.length < 4) {
            setMessage('Name must contain at least 4 characters.');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            setMessage('Phone number must contain exactly 10 digits.');
            return;
        }

        if (formData.password.length < 8) {
            setMessage('Password must contain at least 8 characters.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        phone,
                        email,
                        password: formData.password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = Array.isArray(data.errors)
                    ? data.errors.map(item => item.msg).join(', ')
                    : Array.isArray(data.error)
                        ? data.error.map(item => item.msg).join(', ')
                        : data.error || data.message || 'Registration failed.';

                throw new Error(errorMessage);
            }

            // Store token only if the backend returns one
            if (data.authtoken) {
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('email', email);
            }

            setMessage('Registration successful! Please log in.');

            // Navigate to login
            navigate('/login', {
                replace: true
            });

        } catch (error) {
            console.error('Registration error:', error);
            setMessage(error.message || 'Unable to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">

            <div className="signup">

                <div className="signup-grid">

                    <div className="signup-text">
                        <h1>Sign Up</h1>
                    </div>

                    <div className="signup-text1">
                        Already a member?

                        <span>
                            <Link to="/login"> Login</Link>
                        </span>
                    </div>

                    <div className="signup-form">

                        <form onSubmit={handleSubmit}>

                            {/* NAME */}
                            <div className="form-group">
                                <label htmlFor="name">Name</label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    minLength="4"
                                    required
                                />
                            </div>

                            {/* PHONE */}
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    required
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* PASSWORD */}
                            <div className="form-group">
                                <label htmlFor="password">Password</label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength="8"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            {/* MESSAGE */}
                            {message && (
                                <p
                                    className="auth-message"
                                    role="alert"
                                >
                                    {message}
                                </p>
                            )}

                            {/* BUTTONS */}
                            <div className="btn-group">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Registering...' : 'Submit'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    Reset
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SignUp;
