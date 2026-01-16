import { useNavigate } from 'react-router-dom';
import '../../styles/landingpage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page" data-testid="landing-page">
      {/* Header */}
      <header className="landing-header" data-testid="landing-header">
        <div className="landing-header-content">
          <h1 className="landing-logo" data-testid="landing-logo">QUEUECUT</h1>
          <nav className="landing-nav">
            <a href="#features" className="nav-link" data-testid="find-barber-link">Find a barber</a>
            <button onClick={() => navigate('/login')} className="btn-outline-white" data-testid="login-btn">
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" data-testid="hero-section">
        <div className="hero-badge" data-testid="hero-badge">
          Introducing QUEUECUT AI →
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
      </section>

      {/* Features Section */}
      <section className="features-section" id="features" data-testid="features-section">
        <div className="features-container">
          <h2 className="features-title">Everything you need to succeed</h2>
          <div className="features-grid">
            <div className="feature-card" data-testid="feature-card-1">
              <div className="feature-icon">📅</div>
              <h3>Smart Booking</h3>
              <p>Customers book appointments easily. You approve or reject based on availability.</p>
            </div>
            
            <div className="feature-card" data-testid="feature-card-2">
              <div className="feature-icon">✂️</div>
              <h3>Manage Services</h3>
              <p>Create custom services with your own pricing and duration.</p>
            </div>
            
            <div className="feature-card" data-testid="feature-card-3">
              <div className="feature-icon">👥</div>
              <h3>Team Management</h3>
              <p>Add multiple barbers to your shop and manage their schedules.</p>
            </div>
            
            <div className="feature-card" data-testid="feature-card-4">
              <div className="feature-icon">⭐</div>
              <h3>Build Reputation</h3>
              <p>Collect reviews and ratings to attract more customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" data-testid="cta-section">
        <h2 className="cta-title" data-testid="cta-title">Ready to grow your barbershop?</h2>
        <p className="cta-subtitle" data-testid="cta-subtitle">Join thousands of barbers who trust Queuecut</p>
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
            <h3 className="footer-logo" data-testid="footer-logo">QUEUECUT</h3>
            <p>The essential barbershop management system</p>
          </div>
          
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#" data-testid="features-link">Features</a>
            <a href="#" data-testid="pricing-link">Pricing</a>
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
          <p>© 2025 Queuecut. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;