import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessRegisterSchema } from './schema/businessRegisterSchema';
import { apiCall } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../styles/businessAuth.css';

const BusinessRegister = () => {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(businessRegisterSchema),
    });

    const onSubmit = async (data) => {
        try {
            setApiError('');

            const response = await apiCall('POST', '/business-auth/register', { data });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.dispatchEvent(new Event('token-changed'));

            // Navigate to business dashboard (you'll create this later)
            navigate('/business-dashboard', { replace: true });

        } catch (error) {
            setApiError(error.message || 'Registration failed');
        }
    };

    return (
        <div className="business-auth-container">
            {/* Left Section */}
            <div className="business-auth-left">
                <h2>STAY SHARP<br />AND<br />BUSINESS<br />SAVVY</h2>
                <ul className="business-features">
                    <li>Get and keep more loyal customers</li>
                    <li>Streamline shop management</li>
                    <li>Eliminate no-shows</li>
                    <li>Make more money</li>
                </ul>
            </div>

            {/* Right Section */}
            <div className="business-auth-right">
                <div className="business-auth-header">
                    <div className="business-logo">QUEUELY</div>
                    <div className="business-header-buttons">
                        <button
                            className="btn-business-account"
                            onClick={() => navigate('/business-login')}
                        >
                            Business Account
                        </button>
                        <button
                            className="btn-get-started"
                            onClick={() => navigate('/register')}
                        >
                            GET STARTED
                        </button>
                    </div>
                </div>

                <div className="business-form-section">
                    <p className="business-form-subtitle">
                        100% SUPPORT FROM OUR TEAM · MEET THE BEST GUESTS
                    </p>

                    <h1 className="business-form-title">GET STARTED</h1>
                    <p className="business-form-description">
                        Get a personalized demo for your shop
                    </p>

                    {/* Testimonial */}
                    <div className="business-testimonial">
                        <p>
                            "QUEUELY is IN/10 with the way it handles everyone's appointments and organizes our client database perfectly."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">K</div>
                            <div className="testimonial-info">
                                <h4>Kyle</h4>
                                <p>BARBER/ARTIST</p>
                            </div>
                        </div>
                    </div>

                    <form className="business-auth-form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Shop Name */}
                        <div className="business-form-group">
                            <label className="business-form-label">Shop Name (Company)</label>
                            <input
                                type="text"
                                className="business-form-input"
                                placeholder="Shop name"
                                {...register('shopName')}
                            />
                            {errors.shopName && (
                                <p className="business-error-message">{errors.shopName.message}</p>
                            )}
                        </div>

                        {/* First Name and Last Name */}
                        <div className="business-form-row">
                            <div className="business-form-group">
                                <label className="business-form-label">First Name</label>
                                <input
                                    type="text"
                                    className="business-form-input"
                                    placeholder="First name"
                                    {...register('firstName')}
                                />
                                {errors.firstName && (
                                    <p className="business-error-message">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="business-form-group">
                                <label className="business-form-label">Last Name</label>
                                <input
                                    type="text"
                                    className="business-form-input"
                                    placeholder="Last name"
                                    {...register('lastName')}
                                />
                                {errors.lastName && (
                                    <p className="business-error-message">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="business-form-group">
                            <label className="business-form-label">Email</label>
                            <input
                                type="email"
                                className="business-form-input"
                                placeholder="Email"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="business-error-message">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="business-form-group">
                            <label className="business-form-label">Phone Number</label>
                            <input
                                type="text"
                                className="business-form-input"
                                placeholder="Phone number"
                                {...register('phoneNumber')}
                            />
                            {errors.phoneNumber && (
                                <p className="business-error-message">{errors.phoneNumber.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="business-form-group">
                            <label className="business-form-label">Password</label>
                            <input
                                type="password"
                                className="business-form-input"
                                placeholder="Password"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="business-error-message">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Country */}
                        <div className="business-form-group">
                            <label className="business-form-label">Country</label>
                            <select
                                className="business-form-select"
                                {...register('country')}
                            >
                                <option value="">Select your country</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="CA">Canada</option>
                                <option value="AU">Australia</option>
                                <option value="NP">Nepal</option>
                                <option value="IN">India</option>
                                <option value="PK">Pakistan</option>
                                <option value="BD">Bangladesh</option>
                            </select>
                            {errors.country && (
                                <p className="business-error-message">{errors.country.message}</p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="business-checkbox-group">
                            <input
                                type="checkbox"
                                id="terms"
                                className="business-checkbox"
                                {...register('acceptTerms')}
                            />
                            <label htmlFor="terms" className="business-checkbox-label">
                                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>, including receiving instructional and promotional emails from SQUIRE.
                            </label>
                        </div>
                        {errors.acceptTerms && (
                            <p className="business-error-message">{errors.acceptTerms.message}</p>
                        )}

                        {/* API Error */}
                        {apiError && (
                            <p className="business-error-message" style={{ marginBottom: '15px' }}>
                                {apiError}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn-business-submit"
                        >
                            CONTINUE
                        </button>
                    </form>

                    <div className="business-auth-footer">
                        Already have a Queuely Business Account?{' '}
                        <a onClick={() => navigate('/business-login')}>Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessRegister;