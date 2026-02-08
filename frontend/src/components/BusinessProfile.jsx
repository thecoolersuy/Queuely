import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building,
    Save,
    Loader2,
    Camera,
    Upload,
    AtSign,
    X,
    ChevronDown,
    Settings
} from 'lucide-react';
import axios from 'axios';
import { countries } from '../utils/countries';

const BusinessProfile = ({ onProfileUpdate }) => {
    const [profile, setProfile] = useState({
        shopName: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        localLocation: '',
        profileImage: '',
        businessFocus: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const accentColor = '#2563eb';
    const lightBlue = 'rgba(37, 99, 235, 0.05)';

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

    const clearField = (name) => {
        setProfile(prev => ({ ...prev, [name]: '' }));
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

            formData.append('shopName', profile.shopName || '');
            formData.append('firstName', profile.firstName || '');
            formData.append('lastName', profile.lastName || '');
            formData.append('phoneNumber', profile.phoneNumber || '');
            formData.append('country', profile.country || '');
            formData.append('localLocation', profile.localLocation || '');
            formData.append('businessFocus', JSON.stringify(profile.businessFocus || []));

            if (imageFile) {
                formData.append('profileImage', imageFile);
            }

            const response = await axios.put('http://localhost:5000/api/business-dashboard/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setProfile(prev => ({ ...prev, ...response.data.data }));
                setImageFile(null);

                const user = JSON.parse(localStorage.getItem('user') || '{}');
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <Loader2 className="animate-spin" size={32} color={accentColor} />
            </div>
        );
    }

    const inputStyle = (fieldName) => ({
        width: '100%',
        padding: '12px 16px',
        paddingRight: '40px',
        borderRadius: '12px',
        border: `2px solid ${focusedField === fieldName ? accentColor : '#F3F4F6'}`,
        backgroundColor: focusedField === fieldName ? 'white' : '#F9FAFB',
        fontSize: '15px',
        color: '#1F2937',
        transition: 'all 0.2s ease',
        outline: 'none',
        boxShadow: focusedField === fieldName ? `0 0 0 4px ${lightBlue}` : 'none'
    });

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: '8px',
        marginLeft: '4px'
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Account Settings</h1>
                    <p style={{ color: '#6B7280', fontSize: '15px' }}>
                        Here you can edit public information about yourself.<br />
                        The changes will be displayed for other users within 5 minutes.
                    </p>
                </div>
            </div>

            {message && (
                <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    backgroundColor: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                    color: message.type === 'success' ? '#065F46' : '#991B1B',
                    border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {message.type === 'success' ? <Save size={18} /> : <X size={18} />}
                    <span style={{ fontWeight: '500' }}>{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {/* Left Column - Form */}
                <div style={{ flex: '1', minWidth: '500px' }}>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Email address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                style={{
                                    ...inputStyle('email'),
                                    backgroundColor: '#F3F4F6',
                                    color: '#9CA3AF',
                                    cursor: 'not-allowed'
                                }}
                            />
                            <AtSign size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ flex: '1' }}>
                            <label style={labelStyle}>First Name</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profile.firstName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('firstName')}
                                    onBlur={() => setFocusedField(null)}
                                    style={inputStyle('firstName')}
                                    required
                                />
                                {profile.firstName && (
                                    <X
                                        size={16}
                                        onClick={() => clearField('firstName')}
                                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: 'pointer' }}
                                    />
                                )}
                            </div>
                        </div>
                        <div style={{ flex: '1' }}>
                            <label style={labelStyle}>Last Name</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profile.lastName}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('lastName')}
                                    onBlur={() => setFocusedField(null)}
                                    style={inputStyle('lastName')}
                                    required
                                />
                                {profile.lastName && (
                                    <X
                                        size={16}
                                        onClick={() => clearField('lastName')}
                                        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', cursor: 'pointer' }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Business/Shop Name</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="shopName"
                                value={profile.shopName}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('shopName')}
                                onBlur={() => setFocusedField(null)}
                                style={inputStyle('shopName')}
                                required
                            />
                            <Building size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={labelStyle}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('phoneNumber')}
                                onBlur={() => setFocusedField(null)}
                                style={inputStyle('phoneNumber')}
                                required
                            />
                            <Phone size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ flex: '1' }}>
                            <label style={labelStyle}>Country</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    name="country"
                                    value={profile.country}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('country')}
                                    onBlur={() => setFocusedField(null)}
                                    style={{
                                        ...inputStyle('country'),
                                        appearance: 'none',
                                        cursor: 'pointer'
                                    }}
                                    required
                                >
                                    <option value="">Select country</option>
                                    {countries.map((c) => (
                                        <option key={c.code} value={c.code}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                            </div>
                        </div>
                        {profile.country === 'NP' && (
                            <div style={{ flex: '1' }}>
                                <label style={labelStyle}>Local Location</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        name="localLocation"
                                        value={profile.localLocation || ''}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('localLocation')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="e.g. Kathmandu"
                                        style={inputStyle('localLocation')}
                                    />
                                    <MapPin size={18} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '40px' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '14px 40px',
                                borderRadius: '14px',
                                backgroundColor: accentColor,
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '700',
                                border: 'none',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                boxShadow: `0 8px 20px -6px ${accentColor}88`,
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {saving ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Right Column - Profile Photo */}
                <div style={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>Profile photo</h3>
                    </div>

                    <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '30px' }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: `6px solid white`,
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
                            backgroundColor: '#F3F4F6',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : profile.profileImage ? (
                                <img src={`http://localhost:5000/${profile.profileImage}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={80} color="#9CA3AF" />
                            )}
                        </div>
                        <label
                            htmlFor="profile-upload"
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            <Camera size={20} color={accentColor} />
                            <input
                                type="file"
                                id="profile-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <div style={{
                            padding: '20px',
                            borderRadius: '20px',
                            backgroundColor: '#F9FAFB',
                            border: '1px dashed #D1D5DB'
                        }}>
                            <Upload size={24} color="#9CA3AF" style={{ marginBottom: '10px' }} />
                            <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                                Drag and drop your image here or <label htmlFor="profile-upload" style={{ color: accentColor, cursor: 'pointer', fontWeight: '700' }}>browse</label>
                            </p>
                            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '5px' }}>
                                JPG, PNG up to 5MB
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', width: '100%' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '15px' }}>Business Focus</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {[
                                'Classic Cut', 'Modern Fade', 'Beard Trim',
                                'Hair Styling', 'Kids Cut', 'Hot Shave',
                                'Hair Color', 'Facial', 'Eyebrows'
                            ].map(tag => {
                                const isSelected = (profile.businessFocus || []).includes(tag);
                                return (
                                    <span
                                        key={tag}
                                        onClick={() => {
                                            const currentFocuses = profile.businessFocus || [];
                                            const nextFocuses = isSelected
                                                ? currentFocuses.filter(f => f !== tag)
                                                : [...currentFocuses, tag];
                                            setProfile(prev => ({ ...prev, businessFocus: nextFocuses }));
                                        }}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '20px',
                                            backgroundColor: isSelected ? '#000' : lightBlue,
                                            color: isSelected ? '#FFF' : accentColor,
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            border: `1px solid ${isSelected ? '#000' : accentColor + '33'}`,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        {tag}
                                        {isSelected && <span style={{ fontSize: '10px' }}>✓</span>}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BusinessProfile;
