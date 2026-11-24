
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import './ProfileCard.css';

const ProfileCard = ({ user, onUserUpdated }) => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [sex, setSex] = useState('');
    const [dob, setDob] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Load user details
    useEffect(() => {
        if (!user) return;

        setName(user.name || '');
        setPhone(user.phone || '');
        setBloodGroup(user.bloodGroup || '');
        setSex(user.sex || '');
        setDob(user.dob ? user.dob.substring(0, 10) : '');
        setHeight(user.height || '');
        setWeight(user.weight || '');
        setAddress(user.address || '');
        setEmergencyContact(user.emergencyContact || '');
    }, [user]);

    if (!user) {
        return (
            <div className="patient-profile-layout">
                <main className="patient-profile-card">
                    <h2>Profile Loading...</h2>
                    <p>Please log in to view your profile.</p>
                </main>
            </div>
        );
    }

    // Save profile details
    const handleSave = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (name.trim().length < 4) {
            setError('Name must contain at least 4 characters.');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            setError('Enter a valid 10-digit phone number.');
            return;
        }

        if (emergencyContact && !/^\d{10}$/.test(emergencyContact)) {
            setError('Enter a valid 10-digit emergency contact.');
            return;
        }

        setLoading(true);

        try {
            const token = sessionStorage.getItem('auth-token');

            const response = await fetch(`${API_URL}/api/auth/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'email': user.email
                },
                body: JSON.stringify({
                    name: name.trim(),
                    phone,
                    bloodGroup,
                    sex,
                    dob,
                    height,
                    weight,
                    address,
                    emergencyContact
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    'Unable to update profile.'
                );
            }

            const updatedUser = data.user || data;

            if (onUserUpdated) {
                onUserUpdated(updatedUser);
            }

            setIsEditing(false);
            setMessage('Profile updated successfully!');

        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setName(user.name || '');
        setPhone(user.phone || '');
        setBloodGroup(user.bloodGroup || '');
        setSex(user.sex || '');
        setDob(user.dob ? user.dob.substring(0, 10) : '');
        setHeight(user.height || '');
        setWeight(user.weight || '');
        setAddress(user.address || '');
        setEmergencyContact(user.emergencyContact || '');

        setIsEditing(false);
        setError('');
        setMessage('');
    };

    return (
        <div className="patient-profile-layout">

            <main className="patient-profile-card">

                <div className="patient-profile-heading">
                    <div>
                        <h2>Patient Profile</h2>
                        <p>Manage your personal and health information</p>
                    </div>

                    {!isEditing && (
                        <button
                            type="button"
                            className="profile-edit-btn"
                            onClick={() => {
                                setMessage('');
                                setError('');
                                setIsEditing(true);
                            }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="patient-basic-info">
                    <div className="profile-avatar">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                </div>

                {message && (
                    <p className="profile-success">{message}</p>
                )}

                {error && (
                    <p className="profile-error">{error}</p>
                )}

                <form onSubmit={handleSave}>

                    <div className="patient-fields-grid">

                        <div className="profile-form-group">
                            <label>Full Name</label>
                            <input
                                value={name}
                                disabled={!isEditing}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Email Address</label>
                            <input
                                value={user.email || ''}
                                disabled
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Phone Number</label>
                            <input
                                value={phone}
                                disabled={!isEditing}
                                maxLength="10"
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Blood Group</label>
                            <select
                                value={bloodGroup}
                                disabled={!isEditing}
                                onChange={e => setBloodGroup(e.target.value)}
                            >
                                <option value="">Select blood group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(v => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>

                        <div className="profile-form-group">
                            <label>Sex</label>
                            <select
                                value={sex}
                                disabled={!isEditing}
                                onChange={e => setSex(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="profile-form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                value={dob}
                                disabled={!isEditing}
                                onChange={e => setDob(e.target.value)}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                value={height}
                                disabled={!isEditing}
                                onChange={e => setHeight(e.target.value)}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                disabled={!isEditing}
                                onChange={e => setWeight(e.target.value)}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Emergency Contact</label>
                            <input
                                value={emergencyContact}
                                disabled={!isEditing}
                                maxLength="10"
                                onChange={e => setEmergencyContact(e.target.value)}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Address</label>
                            <input
                                value={address}
                                disabled={!isEditing}
                                onChange={e => setAddress(e.target.value)}
                            />
                        </div>

                    </div>

                    {isEditing && (
                        <div className="profile-actions">

                            <button
                                type="submit"
                                disabled={loading}
                                className="profile-save-btn"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>

                            <button
                                type="button"
                                className="profile-cancel-btn"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                        </div>
                    )}

                </form>

            </main>

            <aside className="patient-side-card">

                <div className="side-card-icon">♥</div>

                <h3>Your Health Matters</h3>

                <p>
                    Keep your personal and medical information updated
                    for a better healthcare experience.
                </p>

                <div className="side-card-divider"></div>

                <h4>Quick Access</h4>

                <button
                    type="button"
                    onClick={() => navigate('/reports')}
                >
                    View Your Reports →
                </button>

                <div className="side-card-note">
                    <strong>Health Tip</strong>
                    <p>
                        Keep your medical reports and emergency
                        contact information up to date.
                    </p>
                </div>

            </aside>

        </div>
    );
};

export default ProfileCard;
