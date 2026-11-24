
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { API_URL } from '../config';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

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

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const email = formData.email.trim().toLowerCase();

        if (!email || !formData.password) {
            setMessage('Please enter your email and password.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    'Login failed. Check your credentials.'
                );
            }

            if (!data.authtoken) {
                throw new Error(
                    'Authentication token was not received.'
                );
            }

            // Store authentication details
            sessionStorage.setItem('auth-token', data.authtoken);
            sessionStorage.setItem('email', email);

            setMessage('Login successful!');

            // Navigate to home page
            navigate('/', { replace: true });

        } catch (error) {
            console.error('Login error:', error);
            setMessage(
                error.message || 'Unable to login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const handleReset = () => {
        setFormData({
            email: '',
            password: ''
        });

        setMessage('');
    };

    return (
        <div className="container">

            <div className="login-grid">

                <div className="login-text">
                    <h2>Login</h2>
                </div>

                <div className="login-text">
                    Are you a new member?

                    <span>
                        <Link to="/signup"> Sign Up Here</Link>
                    </span>
                </div>

                <div className="login-form">

                    <form onSubmit={handleSubmit}>

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
                                autoComplete="email"
                                required
                            />
                        </div>

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
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        {message && (
                            <p className="auth-message" role="alert">
                                {message}
                            </p>
                        )}

                        <div className="btn-group">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
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
    );
};

export default Login;
