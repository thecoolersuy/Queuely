import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, TrendingUp, Clock, Shield, Star, Zap, Scissors } from 'lucide-react';
import { useEffect } from 'react';
import '../../styles/landingpage.css';

// Import images
import bookingMockup from '../../assets/queuelyimage2.jpg';
import barberProfileMockup from '../../assets/queuely2.png';
import analyticsMockup from '../../assets/queuely1.png';
import barberCustomerPhoto from '../../assets/barber_customer_photo.png';
import bookingInterfacePhoto from '../../assets/booking_interface_photo.png';
import happyBarberPhoto from '../../assets/happy_barber_photo.png';
import queuelyLogo from '../../assets/queuelylogo.png';
import premiumDashboardMockup from '../../assets/premium_dashboard_mockup.png';

const CombIcon = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 6h16" />
    <path d="M4 6v12" />
    <path d="M8 6v8" />
    <path d="M12 6v12" />
    <path d="M16 6v8" />
    <path d="M20 6v12" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Scroll parallax for scattered background
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const images = document.querySelectorAll('.scatter-img');
      images.forEach((img, index) => {
        const speed = 0.4 + (index * 0.1); // Increased speed for faster "elevator" effect
        img.style.transform = `translateY(${-(scrolled * speed)}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page" data-testid="landing-page">
      {/* Floating Background Icons */}
      <div className="floating-container">
        <div className="floating-item float-1"><Scissors size={120} strokeWidth={0.5} /></div>
        <div className="floating-item float-2"><CombIcon size={100} /></div>
        <div className="floating-item float-3"><Scissors size={80} strokeWidth={0.5} /></div>
        <div className="floating-item float-4"><CombIcon size={140} /></div>
      </div>

      {/* Header */}
      <header className="landing-header" data-testid="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo" data-testid="landing-logo">
            <img src={queuelyLogo} alt="Queuely Logo" style={{ width: '64px', height: '64px', marginRight: '-10px' }} />
            <h1 style={{ margin: 0, fontSize: '25px' }}>QUEUELY</h1>
          </div>
          <nav className="landing-nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a onClick={() => navigate('/business-register')} className="nav-link" data-testid="find-barber-link">Business</a>
            <button onClick={() => navigate('/login')} className="btn-outline-white" data-testid="login-btn">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-content reveal">
          <div className="hero-badge" data-testid="hero-badge">
            Introducing Queuely <ArrowRight size={16} className="badge-icon" />
          </div>

          <h1 className="hero-title" data-testid="hero-title">
            THE ESSENTIAL APP FOR
            <br />
            EVERY BARBER
          </h1>

          <p className="hero-subtitle" data-testid="hero-subtitle">
            The only system built for barbers at any level,
            <br />
            whether it's just you or a whole crew.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="btn-primary-large"
            data-testid="get-started-btn"
          >
            GET STARTED TODAY
          </button>
        </div>

        {/* Phone Mockups with Box Background */}
        <div className="phone-mockups-container reveal">
          <div className="mockup-bg-box"></div>
          <div className="phone-mockups">
            <div className="phone-mockup phone-left">
              <img src={bookingMockup} alt="Booking interface" />
            </div>
            <div className="phone-mockup phone-center">
              <img src={barberProfileMockup} alt="Barber profile" />
            </div>
            <div className="phone-mockup phone-right">
              <img src={analyticsMockup} alt="Analytics dashboard" />
            </div>
          </div>
        </div>
      </section>

      {/* Scattered Background Images with Elevator Parallax */}
      <section className="bento-section reveal" id="features">
        <div className="scattered-bg-container">
          <img src={bookingMockup} className="scatter-img img-1" alt="Decorative 1" />
          <img src={premiumDashboardMockup} className="scatter-img img-2" alt="Decorative 2" />
          <img src={barberCustomerPhoto} className="scatter-img img-3" alt="Decorative 3" />
          <img src={happyBarberPhoto} className="scatter-img img-4" alt="Decorative 4" />
          <img src={analyticsMockup} className="scatter-img img-5" alt="Decorative 5" />
          <img src={bookingInterfacePhoto} className="scatter-img img-6" alt="Decorative 6" />
        </div>

        <div className="bento-grid">
          {/* Main Block - Fill Your Chair */}
          <div className="bento-item bento-main">
            <div className="bento-content">
              <h2 className="bento-title">FILL YOUR CHAIR</h2>
              <p className="bento-subtitle">Connect with customers through Google and Instagram.</p>
              <button className="btn-bento">Get Found</button>
            </div>
          </div>

          {/* Secondary Block - Loyalty */}
          <div className="bento-item bento-secondary">
            <div className="bento-content">
              <h2 className="bento-title">LOCK IN LOYALTY</h2>
              <p className="bento-subtitle">Launch your site to attract new fans and automated bookings.</p>
            </div>
          </div>

          {/* Small Block - Security */}
          <div className="bento-item bento-small glass-card">
            <div className="bento-icon-box">
              <Shield size={24} color="#4A90E2" />
            </div>
            <h3>Secured Payments</h3>
            <p>Industry standard protection for your earnings.</p>
          </div>

          {/* Small Block - Speed */}
          <div className="bento-item bento-small glass-card">
            <div className="bento-icon-box">
              <Zap size={24} color="#FFD700" />
            </div>
            <h3>Lightning Fast</h3>
            <p>Optimized interface for quick barbershop management.</p>
          </div>
        </div>
      </section>

      {/* Stats Section as Blocks */}
      <section className="stats-section reveal" data-testid="stats-section">
        <div className="stats-grid">
          <div className="stat-block">
            <div className="stat-icon-wrapper"><Calendar size={32} /></div>
            <h3 className="stat-number">10K+</h3>
            <p className="stat-label">Appointments</p>
          </div>
          <div className="stat-block">
            <div className="stat-icon-wrapper"><Users size={32} /></div>
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Active Barbers</p>
          </div>
          <div className="stat-block">
            <div className="stat-icon-wrapper"><Star size={32} /></div>
            <h3 className="stat-number">4.9/5</h3>
            <p className="stat-label">User Rating</p>
          </div>
          <div className="stat-block">
            <div className="stat-icon-wrapper"><Clock size={32} /></div>
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Support</p>
          </div>
        </div>
      </section>

      {/* CTA Section as a Large Block */}
      <section className="cta-block-section reveal" data-testid="cta-section">
        <div className="cta-block">
          <h2 className="cta-title">Ready to grow your barbershop?</h2>
          <p className="cta-subtitle">Join hundreds of barbers who trust Queuely</p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary-large"
            data-testid="cta-btn"
          >
            GET STARTED TODAY
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" data-testid="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo" data-testid="footer-logo">
              <img src={queuelyLogo} alt="Queuely Logo" style={{ height: '60px', marginRight: '1px' }} />
              <h3 style={{ margin: 0, fontSize: '32px' }}>QUEUELY</h3>
            </div>
            <p>The essential barbershop management system</p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-links-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-links-col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Queuely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
