
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sign_Up.css';
import { API_URL } from '../config';

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
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
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = Array.isArray(data.error)
                    ? data.error.map(item => item.msg).join(', ')
                    : data.error || 'Registration failed';

                throw new Error(errorMessage);
            }

            sessionStorage.setItem('auth-token', data.authtoken);
            sessionStorage.setItem('email', formData.email);

            navigate('/login');

        } catch (error) {
            setMessage(error.message);
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

                            <div className="form-group">
                                <label>Name</label>
                                <input
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

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    minLength="10"
                                    maxLength="10"
                                    required
                                />
                            </div>

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
                                    minLength="8"
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
                                    {loading ? 'Registering...' : 'Submit'}
                                </button>

                                <button
                                    type="reset"
                                    className="btn btn-danger"
                                    onClick={() => setFormData({
                                        name: '',
                                        phone: '',
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
        </div>
    );
};

export default SignUp;
