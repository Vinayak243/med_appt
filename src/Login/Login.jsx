
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed. Check your credentials.');
            }

            sessionStorage.setItem('auth-token', data.authtoken);
            sessionStorage.setItem('email', formData.email);

            navigate('/');

        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
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
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {message && (
                            <p className="auth-message">{message}</p>
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
                                type="reset"
                                className="btn btn-danger"
                                onClick={() => setFormData({
                                    email: '',
                                    password: ''
                                })}
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
