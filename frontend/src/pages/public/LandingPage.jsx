import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, TrendingUp, Clock } from 'lucide-react';
import '../../styles/landingpage.css';

// Import images
import bookingMockup from '../../assets/queuelyimage2.jpg';
import barberProfileMockup from '../../assets/queuely2.png';
import analyticsMockup from '../../assets/queuely1.png';
import barberCustomerPhoto from '../../assets/barber_customer_photo.png';
import bookingInterfacePhoto from '../../assets/booking_interface_photo.png';
import happyBarberPhoto from '../../assets/happy_barber_photo.png';
import queuelyLogo from '../../assets/queuelylogo.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page" data-testid="landing-page">
      {/* Header */}
      <header className="landing-header" data-testid="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo" data-testid="landing-logo">
            <img src={queuelyLogo} alt="Queuely Logo" style={{ width: '82px', height: '82px', marginRight: '1px' }} />
            <h1 style={{ margin: 0, fontSize: '35px' }}>QUEUELY</h1>
          </div>
          <nav className="landing-nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#loyalty" className="nav-link">Pricing</a>
            <a onClick={() => navigate('/business-register')} className="nav-link" data-testid="find-barber-link">Business</a>
            <button onClick={() => navigate('/login')} className="btn-outline-white" data-testid="login-btn">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-badge" data-testid="hero-badge">
          Introducing QUEUELY <ArrowRight size={16} style={{ display: 'inline', marginLeft: '4px' }} />
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

        {/* Phone Mockups */}
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
      </section>

      {/* Fill Your Chair Section */}
      <section className="feature-section-alt" id="features" data-testid="fill-chair-section">
        <div className="feature-content-wrapper">
          <div className="feature-text-content">
            <h2 className="feature-section-title">
              FILL YOUR
              <br />
              CHAIR
            </h2>
            <p className="feature-section-subtitle">
              Connect with customers through
              <br />
              Google, Instagram, and <span className="highlight">SQUIRE</span>
            </p>
            <button className="btn-get-found">
              Get Found
            </button>
          </div>
          <div className="feature-image-content">
            <div className="feature-image-wrapper orange-bg">
              <img src={barberCustomerPhoto} alt="Barber with customer" className="feature-photo" />
              <div className="booking-card">
                <img src={bookingInterfacePhoto} alt="Booking interface" className="booking-interface" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lock In Loyalty Section */}
      <section className="feature-section-alt dark-section" id="loyalty" data-testid="loyalty-section">
        <div className="feature-content-wrapper reverse">
          <div className="feature-text-content">
            <h2 className="feature-section-title">
              LOCK IN
              <br />
              LOYALTY
            </h2>
            <p className="feature-section-subtitle">
              Launch your own booking
              <br />
              site to attract new fans and
              <br />
              keep your best clients coming back
            </p>
          </div>
          <div className="feature-image-content">
            <div className="feature-image-wrapper pink-bg">
              <img src={happyBarberPhoto} alt="Happy barber" className="feature-photo-large" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" data-testid="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={40} />
            </div>
            <h3 className="stat-number">10K+</h3>
            <p className="stat-label">Appointments Booked</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={40} />
            </div>
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Active Barbers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={40} />
            </div>
            <h3 className="stat-number">95%</h3>
            <p className="stat-label">Customer Satisfaction</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={40} />
            </div>
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Support Available</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" data-testid="cta-section">
        <h2 className="cta-title" data-testid="cta-title">Ready to grow your barbershop?</h2>
        <p className="cta-subtitle" data-testid="cta-subtitle">Join hundreds of barbers who trust Queuely</p>
        <button
          onClick={() => navigate('/register')}
          className="btn-primary-large"
          data-testid="cta-btn"
        >
          GET STARTED TODAY
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer" data-testid="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo" data-testid="footer-logo">
              <img src={queuelyLogo} alt="Queuely Logo" style={{ height: '40px', marginRight: '6px' }} />
              <h3 style={{ margin: 0, fontSize: '40px' }}>QUEUELY</h3>
            </div>
            <p>The essential barbershop management system</p>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features" data-testid="features-link">Features</a>
            <a href="#pricing" data-testid="pricing-link">Pricing</a>
            <a href="#" data-testid="demo-link">Request Demo</a>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <a href="#" data-testid="about-link">About</a>
            <a href="#" data-testid="contact-link">Contact</a>
            <a href="#" data-testid="careers-footer-link">Careers</a>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#" data-testid="privacy-link">Privacy</a>
            <a href="#" data-testid="terms-footer-link">Terms</a>
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