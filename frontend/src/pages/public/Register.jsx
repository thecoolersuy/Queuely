import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from './schema/registerSchema';
import { apiCall } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import '../../styles/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');

      // Add role as customer (hidden field)
      const registerData = { ...data, role: 'customer' };

      const response = await apiCall('POST', '/auth/register', { data: registerData });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Notify other parts of the app (same-window) that token changed
      window.dispatchEvent(new Event('token-changed'));

      // Navigate to homepage
      navigate('/homepage', { replace: true });

    } catch (error) {
      setApiError(error.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h1 className="logo">QUEUELY</h1>

      <div className="form-card">
        <h2 className="form-title">Let's get you started</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Name"
              {...register('name')}
            />
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="Location"
              {...register('location')}
            />
            {errors.location && (
              <p className="error-message">{errors.location.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="Username or Email"
              {...register('email')}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <p className="error-message" style={{ marginBottom: '15px' }}>
              {apiError}
            </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-primary" >
            Sign up
          </button>
        </form>

        <div className="auth-footer">
          Already have a Queuely Account?{' '}
          <a href="/login" className="auth-link">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;