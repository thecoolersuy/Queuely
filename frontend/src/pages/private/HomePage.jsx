import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { apiCall } from '../../utils/api';
import NotificationPanel from '../../components/NotificationPanel';
import '../../styles/homepage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('New York');
  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use the auth hook for authentication check and redirect
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [userLocation, setUserLocation] = useState('New York');

  useEffect(() => {
    // Get user location from local storage (it should be saved on login usually)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.location) {
      setUserLocation(user.location);
    }
  }, []);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // We can use the token if available, or make this a public route if desired.
        // The router currently requires authentication.
        const token = localStorage.getItem('token');
        if (token) {
          const response = await apiCall('GET', '/user/businesses', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setBarbershops(response.data.data);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch businesses", error);
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchBusinesses();
    }
  }, [authLoading]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // notify other listeners in this window
    window.dispatchEvent(new Event('token-changed'));
    navigate('/login');
  };

  const handleRegisterBusiness = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Using window.location.href for a full reload to the business register page.
    // This prevents the current PrivateRoute from redirecting to /login before
    // the new route is fully handled by the router.
    window.location.href = '/business-register';
  };

  // Show loading state while checking authentication
  if (authLoading || loading) {
    return (
      <div className="homepage" data-testid="homepage-loading">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage" data-testid="homepage">
      <header className="header" data-testid="header">
        <div className="header-content">
          <div className="logo" data-testid="logo">
            <h1 style={{ letterSpacing: '-0.8px' }}>Queuely</h1>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for barbers, shops, or services..."
              className="search-input"
              data-testid="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon"><Search size={18} /></span>
          </div>

          <div className="header-right">
            <div className="location-display">
              <span><MapPin size={18} /></span>
              <span>{userLocation}</span>
            </div>

            <NotificationPanel />

            <button onClick={handleLogout} className="btn-outline" data-testid="logout-btn">
              Log Out
            </button>

            <button onClick={handleRegisterBusiness} className="btn-primary" data-testid="register-business-btn">
              Register Your Business
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" data-testid="main-content">
        <div className="container">
          {/* Title Section */}
          <div className="title-section" data-testid="title-section">
            <div>
              <p className="breadcrumb" data-testid="breadcrumb">Marketplace › {userLocation}</p>
              <h2 className="page-title" data-testid="page-title">Find a haircut in {userLocation}</h2>
              <p className="subtitle" data-testid="subtitle">{barbershops.length} shops found</p>
            </div>
            <div className="filter-buttons">
              <button className="btn-filter" data-testid="filters-btn">Filters</button>
              <button className="btn-high-rating" data-testid="high-rating-btn"><Star size={14} fill="currentColor" /> High rating</button>
            </div>
          </div>

          {/* Barbershop Grid */}
          <div className="shop-grid" data-testid="shop-grid">
            {barbershops.length === 0 ? (
              <p>No barbershops found.</p>
            ) : (
              barbershops.map((shop) => (
                <ShopCard key={shop.business_id} shop={shop} />
              ))
            )}
          </div>

          {/* Show More */}
          <div className="show-more">
            <button className="btn-show-more" data-testid="show-more-btn">Show more results</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo" data-testid="footer-logo">
              <h3 style={{ letterSpacing: '-0.8px' }}>Queuely</h3>
            </div>
            <p>The only all-in-one barbershop</p>
            <p>business management system.</p>
            <p>Helping barbers and shops</p>
            <p>succeed since 2015.</p>
          </div>

          <div className="footer-links">
            <div>
              <h4>About Us</h4>
              <ul>
                <li><a href="#" data-testid="careers-link">Careers</a></li>
                <li><a href="#" data-testid="press-link">Press</a></li>
                <li><a href="#" data-testid="support-link">Support</a></li>
              </ul>
            </div>
            <div>
              <h4>Social</h4>
              <ul>
                <li><a href="#" data-testid="twitter-link">Twitter</a></li>
                <li><a href="#" data-testid="facebook-link">Facebook</a></li>
                <li><a href="#" data-testid="linkedin-link">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Queuely Technologies, Inc. All rights reserved.</p>
          <div>
            <a href="#" data-testid="privacy-policy-link">Privacy Policy</a> · <a href="#" data-testid="terms-link">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Shop Card Component
const ShopCard = ({ shop }) => {
  const navigate = useNavigate();

  const imageUrl = shop.profileImage
    ? `http://localhost:5000/${shop.profileImage}`
    : null;

  const handleClick = () => {
    navigate(`/barbershop/${shop.business_id}`);
  };

  return (
    <div className="shop-card" data-testid={`shop-card-${shop.business_id}`} onClick={handleClick}>
      <div className="shop-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={shop.shopName} className="shop-image" data-testid={`shop-image-${shop.business_id}`} />
        ) : (
          <div className="shop-image-placeholder" data-testid={`shop-image-placeholder-${shop.business_id}`}></div>
        )}
      </div>
      <div className="shop-info">
        <div className="shop-header">
          <div className="shop-icon" data-testid={`shop-icon-${shop.business_id}`}>
            {shop.shopName ? shop.shopName.charAt(0) : 'B'}
          </div>
          <div>
            <h3 className="shop-name" data-testid={`shop-name-${shop.business_id}`}>{shop.shopName}</h3>
            <p className="shop-address" data-testid={`shop-address-${shop.business_id}`}>{shop.country}</p>
          </div>
        </div>
        <div className="shop-rating" data-testid={`shop-rating-${shop.business_id}`}>
          <span className="rating">5.0</span>
          <span className="stars">
            {[...Array(1)].map((_, i) => (
              <Star key={i} size={18} fill="#FFD700" color="#FFD700" />
            ))}
          </span>
          <span className="reviews">(0)</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;