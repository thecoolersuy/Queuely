import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessLoginSchema } from './schema/businessLoginSchema';
import { apiCall } from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import '../../styles/businessAuth.css';

const BusinessLogin = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(businessLoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');

      const response = await apiCall('POST', '/business-auth/login', { data });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('token-changed'));

      // Navigate to business dashboard
      navigate('/business-dashboard', { replace: true });

    } catch (error) {
      setApiError(error.message || 'Login failed');
    }
  };

  return (
    <div className="business-auth-container">
      <Link to="/" className="back-button">
        <ArrowLeft size={20} />
        Back to Home
      </Link>
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
              onClick={() => navigate('/business-register')}
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
            FILL THIS FORM IF YOU ARE A BARBER OR OWN A BARBERSHOP
          </p>

          <h1 className="business-form-title">WELCOME BACK, SIR!</h1>
          <p className="business-form-description">
            Ready to spice up your business
          </p>

          <form className="business-auth-form" onSubmit={handleSubmit(onSubmit)}>
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

            {/* Forgot Password */}
            <div className="business-forgot-password">
              <a href="#">Forgot password?</a>
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
              LOGIN
            </button>
          </form>

          <div className="business-auth-footer">
            Don't have a Queuely Business Account?{' '}
            <a onClick={() => navigate('/business-register')}>Register</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessLogin;