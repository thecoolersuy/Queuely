import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import { User, Mail, Phone, MapPin, Building, Save, Loader2, Camera, Upload } from 'lucide-react';
import axios from 'axios'; // We might need direct axios for FormData if apiCall wrapper is strict on JSON
// Actually, let's just use fetch or axios directly for the upload to handle FormData easier if the wrapper is complex. 
// But assuming we can modify how we call the API.
// Let's stick to the existing apiCall if possible, but standard fetch is safer for FormData often to avoid header issues.

const BusinessProfile = ({ onProfileUpdate }) => {
    const [profile, setProfile] = useState({
        shopName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        profileImage: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await apiCall('GET', '/business-dashboard/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProfile(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'error', text: 'Failed to load profile' });
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            // Append text fields
            formData.append('shopName', profile.shopName || '');
            formData.append('firstName', profile.firstName || '');
            formData.append('lastName', profile.lastName || '');
            formData.append('phoneNumber', profile.phoneNumber || '');
            formData.append('country', profile.country || '');

            // Append file if exists
            if (imageFile) {
                formData.append('profileImage', imageFile);
            }

            // Use axios directly for FormData to ensure proper content type handling
            // The apiCall wrapper might force JSON content type or stringify body
            const response = await axios.put('http://localhost:5000/api/business-dashboard/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });

                // Update profile state
                setProfile(prev => ({
                    ...prev,
                    ...response.data.data
                }));
                setImageFile(null); // Reset file input

                // Update local storage user info if shop name changed
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                // Check if shopName changed or we have a new profile image (to maybe update avatar in future)
                if (user.shopName !== response.data.data.shopName) {
                    user.shopName = response.data.data.shopName;
                    localStorage.setItem('user', JSON.stringify(user));
                    if (onProfileUpdate) onProfileUpdate();
                }
            }
            setSaving(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile' });
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '300px' }}>
                <Loader2 className="animate-spin" size={32} color="#3b82f6" />
            </div>
        );
    }

    return (
        <div className="profile-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="dashboard-header">
                <h1 style={{ color: 'black' }}>Business Profile</h1>
                <p style={{ color: 'black' }}>Manage your business information and settings.</p>
            </div>

            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                {message && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            marginBottom: '16px',
                            border: '4px solid #f3f4f6',
                            position: 'relative',
                            backgroundColor: '#e5e7eb',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : profile.profileImage ? (
                                <img src={`http://localhost:5000/${profile.profileImage}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={48} color="#9ca3af" />
                            )}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <input
                                type="file"
                                id="profile-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label
                                htmlFor="profile-upload"
                                style={{
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: 'white',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Camera size={16} />
                                Change Photo
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Business Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Building size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    name="shopName"
                                    value={profile.shopName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                First Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profile.firstName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Last Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profile.lastName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    disabled
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        fontSize: '16px',
                                        backgroundColor: '#f9fafb',
                                        color: '#6b7280',
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Email cannot be changed directly.</p>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Phone Number
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={profile.phoneNumber}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Country
                            </label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    name="country"
                                    value={profile.country}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 24px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                border: 'none',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessProfile;
