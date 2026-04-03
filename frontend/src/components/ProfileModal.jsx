import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileModal.css';

export default function ProfileModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const rawData = localStorage.getItem('userData');
            if (rawData) {
                try {
                    setUser(JSON.parse(rawData));
                } catch (e) {
                    console.error("Error parsing user data", e);
                }
            } else {
                // Fallbacks if userData isn't fully set yet
                setUser({
                    name: localStorage.getItem('userName'),
                    phone: localStorage.getItem('userPhone'),
                    role: localStorage.getItem('role')
                });
            }
        }
    }, [isOpen]);

    const handleLogout = () => {
        localStorage.clear();
        onClose();
        navigate('/');
    };

    if (!isOpen) return null;

    return (
        <div className="profile-modal-overlay" onClick={onClose}>
            <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile-modal-header">
                    <h3>My Profile</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="profile-content">
                    <div className="profile-avatar">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>

                    {user ? (
                        <div className="profile-details">
                            <div className="profile-field">
                                <label>Name</label>
                                <p>{user.name || user.displayName || 'N/A'}</p>
                            </div>
                            <div className="profile-field">
                                <label>Phone Number</label>
                                <p>{user.phone || 'N/A'}</p>
                            </div>
                            <div className="profile-field">
                                <label>Role</label>
                                <p>{user.role || localStorage.getItem('role') || 'N/A'}</p>
                            </div>
                            {user.gender && (
                                <div className="profile-field">
                                    <label>Gender</label>
                                    <p>{user.gender}</p>
                                </div>
                            )}
                            {user.aadhar && (
                                <div className="profile-field">
                                    <label>Aadhar ID</label>
                                    <p>{user.aadhar}</p>
                                </div>
                            )}
                            {user.address && (
                                <div className="profile-field">
                                    <label>Address</label>
                                    <p>{user.address}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading profile data...</p>
                    )}

                    <div className="profile-actions">
                        <button className="logout-btn" onClick={handleLogout}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
