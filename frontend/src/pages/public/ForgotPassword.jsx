import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck, KeyRound, CheckCircle2, Loader2 } from 'lucide-react';
import { apiCall } from '../../utils/api';
import '../../styles/auth.css';
import '../../styles/forgotPassword.css';

// Determines which API prefix to use based on the type prop
const ForgotPassword = ({ type = 'customer' }) => {
    const navigate = useNavigate();
    const apiPrefix = type === 'business' ? '/business-auth' : '/auth';
    const loginPath = type === 'business' ? '/business-login' : '/login';

    // step: 1 = enter email, 2 = enter otp, 3 = new password, 4 = success
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ─── STEP 1: Send OTP ─────────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) return setError('Please enter your email.');
        setLoading(true);
        try {
            await apiCall('POST', `${apiPrefix}/forgot-password`, { data: { email } });
            setStep(2);
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // ─── OTP Input handler (auto-advance) ─────────────────────────────────────
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // only digits
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // only last char
        setOtp(newOtp);
        // auto-advance to next box
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            document.getElementById('otp-5')?.focus();
        }
        e.preventDefault();
    };

    // ─── STEP 2: Verify OTP ───────────────────────────────────────────────────
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        const otpString = otp.join('');
        if (otpString.length < 6) return setError('Please enter the full 6-digit OTP.');
        setLoading(true);
        try {
            await apiCall('POST', `${apiPrefix}/verify-otp`, { data: { email, otp: otpString } });
            setStep(3);
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ─── STEP 3: Reset Password ───────────────────────────────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) return setError('Password must be at least 6 characters.');
        if (newPassword !== confirmPassword) return setError('Passwords do not match.');
        setLoading(true);
        try {
            await apiCall('POST', `${apiPrefix}/reset-password`, { data: { email, newPassword } });
            setStep(4);
        } catch (err) {
            setError(err.message || 'Failed to reset password. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResend = async () => {
        setError('');
        setLoading(true);
        setOtp(['', '', '', '', '', '']);
        try {
            await apiCall('POST', `${apiPrefix}/forgot-password`, { data: { email } });
        } catch (err) {
            setError('Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, label: 'Email', icon: Mail },
        { num: 2, label: 'OTP', icon: ShieldCheck },
        { num: 3, label: 'Reset', icon: KeyRound },
    ];

    return (
        <div className="auth-container">
            <Link to={loginPath} className="back-button">
                <ArrowLeft size={20} />
                Back to Login
            </Link>

            <div className="logo">
                <h1 style={{ letterSpacing: '-0.8px' }}>Queuely</h1>
            </div>

            <div className="form-card fp-card">

                {/* ── Progress Steps ── */}
                {step < 4 && (
                    <div className="fp-steps">
                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            const isCompleted = step > s.num;
                            const isActive = step === s.num;
                            return (
                                <div key={s.num} className="fp-step-wrapper">
                                    <div className={`fp-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                        {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                                    </div>
                                    <span className={`fp-step-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                        {s.label}
                                    </span>
                                    {i < steps.length - 1 && (
                                        <div className={`fp-connector ${step > s.num ? 'filled' : ''}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── STEP 1: Enter Email ── */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="fp-form">
                        <div className="fp-icon-wrapper">
                            <Mail size={28} color="#3b82f6" />
                        </div>
                        <h2 className="form-title" style={{ textAlign: 'center' }}>Forgot Password?</h2>
                        <p className="fp-subtitle">No worries! Enter your email and we'll send you a 6-digit OTP.</p>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {error && <p className="error-message" style={{ marginBottom: '12px' }}>{error}</p>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? <span className="fp-loading"><Loader2 size={18} className="fp-spin" /> Sending OTP...</span> : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* ── STEP 2: Enter OTP ── */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="fp-form">
                        <div className="fp-icon-wrapper">
                            <ShieldCheck size={28} color="#3b82f6" />
                        </div>
                        <h2 className="form-title" style={{ textAlign: 'center' }}>Enter OTP</h2>
                        <p className="fp-subtitle">
                            We sent a 6-digit code to <strong style={{ color: '#fff' }}>{email}</strong>. Check your inbox (and spam folder).
                        </p>

                        <div className="fp-otp-grid" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    className={`fp-otp-box ${digit ? 'filled' : ''}`}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        {error && <p className="error-message" style={{ marginBottom: '12px', textAlign: 'center' }}>{error}</p>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? <span className="fp-loading"><Loader2 size={18} className="fp-spin" /> Verifying...</span> : 'Verify OTP'}
                        </button>

                        <p className="fp-resend">
                            Didn't receive the code?{' '}
                            <button type="button" className="fp-resend-btn" onClick={handleResend} disabled={loading}>
                                Resend OTP
                            </button>
                        </p>
                    </form>
                )}

                {/* ── STEP 3: New Password ── */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="fp-form">
                        <div className="fp-icon-wrapper">
                            <KeyRound size={28} color="#3b82f6" />
                        </div>
                        <h2 className="form-title" style={{ textAlign: 'center' }}>Create New Password</h2>
                        <p className="fp-subtitle">Choose a strong password you haven't used before.</p>

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="At least 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Password strength indicator */}
                        {newPassword && (
                            <div className="fp-strength">
                                <div className={`fp-strength-bar ${newPassword.length >= 6 ? newPassword.length >= 10 ? 'strong' : 'medium' : 'weak'}`} />
                                <span className={`fp-strength-label ${newPassword.length >= 6 ? newPassword.length >= 10 ? 'strong' : 'medium' : 'weak'}`}>
                                    {newPassword.length >= 10 ? 'Strong' : newPassword.length >= 6 ? 'Medium' : 'Too short'}
                                </span>
                            </div>
                        )}

                        {error && <p className="error-message" style={{ marginBottom: '12px' }}>{error}</p>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? <span className="fp-loading"><Loader2 size={18} className="fp-spin" /> Resetting...</span> : 'Reset Password'}
                        </button>
                    </form>
                )}

                {/* ── STEP 4: Success ── */}
                {step === 4 && (
                    <div className="fp-form fp-success">
                        <div className="fp-success-icon">
                            <CheckCircle2 size={56} color="#22c55e" />
                        </div>
                        <h2 className="form-title" style={{ textAlign: 'center' }}>Password Reset!</h2>
                        <p className="fp-subtitle" style={{ textAlign: 'center' }}>
                            Your password has been changed successfully. You can now log in with your new password.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate(loginPath)}
                            style={{ marginTop: '8px' }}
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
