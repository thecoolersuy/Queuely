import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './schema/loginSchema';
import { apiCall } from '../../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import '../../styles/auth.css';
import queuelyLogo from '../../assets/queuelylogo.png';

const Login = () => {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError('');

      const response = await apiCall('POST', '/auth/login', { data });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Notify other parts of the app (same-window) that token changed
      window.dispatchEvent(new Event('token-changed'));

      // Navigate to homepage
      navigate('/homepage', { replace: true });

    } catch (error) {
      setApiError(error.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="back-button">
        <ArrowLeft size={20} />
        Back to Home
      </Link>
      <div className="logo">
        <img src={queuelyLogo} alt="Queuely Logo" />
        <h1>QUEUELY</h1>
      </div>

      <div className="form-card">
        <h2 className="form-title">Let's get you signed in</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
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

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <a href="/forgot-password" className="auth-link" style={{ fontSize: '0.9rem' }}>
              Forgot password?
            </a>
          </div>

          {/* API Error */}
          {apiError && (
            <p className="error-message" style={{ marginBottom: '15px' }}>
              {apiError}
            </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have a Queuely Account?{' '}
          <a href="/register" className="auth-link">Sign up now</a>
        </div>
      </div>
    </div>
  );
};

export default Login;