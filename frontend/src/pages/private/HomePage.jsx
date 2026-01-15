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
      address: '318 East 6th Street, New York, NY',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
    },
    {
      id: 2,
      name: 'Barbarossa',
      rating: 5.0,
      reviews: 95,
      address: '1094 Lexington Avenue, New York, NY',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400',
    },
    {
      id: 3,
      name: 'Artisan Barber',
      rating: 5.0,
      reviews: 203,
      address: '311 East 3 Street, Manhattan, NY',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    },
    {
      id: 4,
      name: 'Elegant Barbershop',
      rating: 5.0,
      reviews: 156,
      address: '317 East 67th Street, New York, NY',
      image: 'https://images.unsplash.com/photo-1622286346003-c75f0f1a5940?w=400',
    },
    {
      id: 5,
      name: 'Beyond The Beard',
      rating: 5.0,
      reviews: 89,
      address: '194 E 11th Street, New York, NY',
      image: 'https://images.unsplash.com/photo-1598199877561-6ca884143863?w=400',
    },
    {
      id: 6,
      name: 'Midtown East Barbers',
      rating: 5.0,
      reviews: 142,
      address: '956 2 37 Avenue, New York, NY',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
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
    <div className="homepage">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">QUEUELY</h1>

          {/* <div className="header-right"> */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for barbers, shops, or services..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            {/* </div> */}

            <div className="location-dropdown">
              <span>📍</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="location-select"
              >
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
              </select>
            </div>

            <button onClick={handleLogout} className="btn-outline">
              Log Out
            </button>

            <button onClick={handleRegisterBusiness} className="btn-primary">
              Register your Business
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Title Section */}
          <div className="title-section">
            <div>
              <p className="breadcrumb">Minneapolis › New York</p>
              <h2 className="page-title">Find a haircut in New York</h2>
              <p className="subtitle">128 shops found nearby</p>
            </div>
            <div className="filter-buttons">
              <button className="btn-filter">⚙️ Filters</button>
              <button className="btn-high-rating">⭐ High rating</button>
            </div>
          </div>

          {/* Barbershop Grid */}
          <div className="shop-grid">
            {barbershops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>

          {/* Show More */}
          <div className="show-more">
            <button className="btn-show-more">Show more results</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3 className="footer-logo">QUEUELY</h3>
            <p>The only all-in-one barbershop</p>
            <p>business management system.</p>
            <p>Helping barbers and shops</p>
            <p>succeed since 2015.</p>
            <button className="btn-footer">GET STARTED</button>
          </div>

          <div className="footer-links">
            <div>
              <h4>About Us</h4>
              <ul>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            <div>
              <h4>Instagram</h4>
              <ul>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 SQUIRE Technologies, Inc. All rights reserved.</p>
          <div>
            <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
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
    <div className="shop-card">
      <div className="shop-image-container">
        <img src={shop.image} alt={shop.name} className="shop-image" />
        <button
          className="favorite-btn"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="shop-info">
        <div className="shop-header">
          <div className="shop-icon">
            {shop.name.charAt(0)}
          </div>
          <div>
            <h3 className="shop-name">{shop.name}</h3>
            <p className="shop-address">{shop.address}</p>
          </div>
        </div>
        <div className="shop-rating">
          <span className="rating">{shop.rating}</span>
          <span className="stars">⭐⭐⭐⭐⭐</span>
          <span className="reviews">({shop.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default Homepage;