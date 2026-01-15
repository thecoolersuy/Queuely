import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/homepage.css'; // We'll create this

const Homepage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('New York');

  const barbershops = [
    {
      id: 1,
      name: 'Razors and Scotch',
      rating: 5.0,
      reviews: 128,
      address: '318 East 65th Street, New York, NY',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80',
      initials: 'RS'
    },
    {
      id: 2,
      name: 'Barbarossa',
      rating: 5.0,
      reviews: 95,
      address: '1094 Lexington Avenue, New York, NY',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80',
      initials: 'BB'
    },
    {
      id: 3,
      name: 'Artisan Barber',
      rating: 5.0,
      reviews: 203,
      address: '311 East 3 Street, Manhattan, NY',
      image: 'https://images.unsplash.com/photo-1610475680335-dafab5475150?w=500&q=80',
      initials: 'AB'
    },
    {
      id: 4,
      name: 'Elegant Barbershop',
      rating: 5.0,
      reviews: 156,
      address: '317 East 67th Street, New York, NY',
      image: 'https://images.unsplash.com/photo-1647140655214-e4a2d914971f?w=500&q=80',
      initials: 'EB'
    },
    {
      id: 5,
      name: 'Beyond The Beard',
      rating: 5.0,
      reviews: 89,
      address: '194 E 11th Street, New York, NY',
      image: 'https://images.unsplash.com/photo-1621645582931-d1d3e6564943?w=500&q=80',
      initials: 'BTB'
    },
    {
      id: 6,
      name: 'Midtown East Barbers',
      rating: 5.0,
      reviews: 142,
      address: '956 2 37 Avenue, New York, NY',
      image: 'https://images.unsplash.com/photo-1667539916671-b9e7039ccee5?w=500&q=80',
      initials: 'ME'
    },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleRegisterBusiness = () => {
    navigate('/business-register');
  };

  return (
    <div className="homepage" data-testid="homepage">
      <header className="header" data-testid="header">
        <div className="header-content">
          <h1 className="logo" data-testid="logo">QUEUELY</h1>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search for barbers, shops, or services..."
              className="search-input"
              data-testid="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon"></span>
          </div>

          <div className="location-dropdown" data-testid="location-dropdown">

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-select"
              data-testid="location-select"
            >
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>

          <button onClick={handleLogout} className="btn-outline" data-testid="logout-btn">
            Log Out
          </button>

          <button onClick={handleRegisterBusiness} className="btn-primary" data-testid="register-business-btn">
            Register your Business
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" data-testid="main-content">
        <div className="container">
          {/* Title Section */}
          <div className="title-section" data-testid="title-section">
            <div>
              <p className="breadcrumb" data-testid="breadcrumb">Marketplace › New York</p>
              <h2 className="page-title" data-testid="page-title">Find a haircut in New York</h2>
              <p className="subtitle" data-testid="subtitle">128 shops found nearby</p>
            </div>
            <div className="filter-buttons">
              <button className="btn-filter" data-testid="filters-btn">Filters</button>
              <button className="btn-high-rating" data-testid="high-rating-btn">High rating</button>
            </div>
          </div>

          {/* Barbershop Grid */}
          <div className="shop-grid" data-testid="shop-grid">
            {barbershops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
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
            <h3 className="footer-logo" data-testid="footer-logo">QUEUELY</h3>
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
              <h4>Instagram</h4>
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
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="shop-card" data-testid={`shop-card-${shop.id}`}>
      <div className="shop-image-container">
        <img src={shop.image} alt={shop.name} className="shop-image" data-testid={`shop-image-${shop.id}`} />
        
      </div>
      <div className="shop-info">
        <div className="shop-header">
          <div className="shop-icon" data-testid={`shop-icon-${shop.id}`}>
            {shop.initials}
          </div>
          <div>
            <h3 className="shop-name" data-testid={`shop-name-${shop.id}`}>{shop.name}</h3>
            <p className="shop-address" data-testid={`shop-address-${shop.id}`}>{shop.address}</p>
          </div>
        </div>
        <div className="shop-rating" data-testid={`shop-rating-${shop.id}`}>
          <span className="rating">{shop.rating}</span>
          <span className="stars">⭐⭐⭐⭐⭐</span>
          <span className="reviews">({shop.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default Homepage;