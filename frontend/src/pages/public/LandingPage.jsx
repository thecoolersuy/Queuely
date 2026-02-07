import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Users, TrendingUp, Clock, Shield, Star, Zap, Scissors, Megaphone, BarChart3, Eye, Heart } from 'lucide-react';
import { useEffect } from 'react';
import '../../styles/landingpage.css';

// Import images
import bookingMockup from '../../assets/queuelyimage2.jpg';
import barberProfileMockup from '../../assets/queuely2.png';
import analyticsMockup from '../../assets/queuely1.png';
import barberCustomerPhoto from '../../assets/barber_customer_photo.png';
import bookingInterfacePhoto from '../../assets/booking_interface_photo.png';
import happyBarberPhoto from '../../assets/happy_barber_photo.png';
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

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="landing-page" data-testid="landing-page">
      {/* Header */}
      <header className="landing-header" data-testid="landing-header">
        <div className="landing-header-content">
          <h1 style={{ margin: 0, fontSize: '28px', letterSpacing: '-0.8px' }}>Queuely</h1>
          <nav className="landing-nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#blogs" className="nav-link">Blogs</a>
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

      {/* Bento Grid Features */}
      <section className="bento-section reveal" id="features">
        <div className="bento-grid">
          {/* Feature 1 - Brand Development */}
          <div className="bento-item">
            <div className="bento-icon-box">
              <Megaphone size={32} />
            </div>
            <h3>Brand Development</h3>
            <p>Our awesome team effortlessly blends research-driven ideas for a super effective and all-around approach. Navigating the never-ending adventure of branding becomes a breeze with our seasoned consultants leading the way.</p>
          </div>

          {/* Feature 2 - Data Driven Marketing */}
          <div className="bento-item">
            <div className="bento-icon-box">
              <BarChart3 size={32} />
            </div>
            <h3>Data Driven Marketing</h3>
            <p>Going data-driven is like having a secret weapon for success. It's the key to connecting with our community and building a strong brand. We dive deep into research before unleashing our creative ideas, giving us the edge.</p>
          </div>

          {/* Feature 3 - Impactful Visuals */}
          <div className="bento-item">
            <div className="bento-icon-box">
              <Eye size={32} />
            </div>
            <h3>Impactful Visuals</h3>
            <p>Picture this: when it comes to storytelling and branding, visuals are the real game-changers. Our crew of creative wizards knows how to turn ideas into reality, spinning stories that just click with our viewers.</p>
          </div>

          {/* Feature 4 - Exhilarating Events */}
          <div className="bento-item">
            <div className="bento-icon-box">
              <Star size={32} />
            </div>
            <h3>Exhilarating Events</h3>
            <p>Time to make memories, forge new friendships, and strengthen bonds with your community, colleagues, and audience. Our squad of awesome and creative pros ensures that every event is not just good but downright epic.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section reveal" id="blogs" data-testid="trust-section">
        <div className="trust-container">
          <div className="trust-description">
            <p>With an extensive journey in the grooming industry, we've collaborated with hundreds of barbershops, fostering genuine connections within communities through authentic tools and pioneering management strategies.</p>
            <p>Our experiences have not only crafted meaningful relationships but also ushered in significant transformations, leading to purposeful and impactful growth for every partner. Join us in the journey of building a brand that stands out.</p>
          </div>
          <div className="trust-typography">
            <div className="typography-wrapper">
              <h2 className="handwritten-text">
                WE'RE <br />
                LOVED <br />
                BY <span className="text-accent">MANY</span>
              </h2>
              <div className="heart-icon-wrapper">
                <Heart size={80} fill="#3b82f6" stroke="none" />
              </div>
            </div>
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
              <h3 style={{ margin: 0, fontSize: '32px', letterSpacing: '-0.8px' }}>Queuely</h3>
            </div>
            <p>The essential barbershop management system</p>
          </div>

          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#blogs">Blogs</a>
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
