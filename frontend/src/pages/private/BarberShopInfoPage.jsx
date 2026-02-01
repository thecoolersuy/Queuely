import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Calendar } from 'lucide-react';
import { apiCall } from '../../utils/api';
import '../../styles/barbershopinfo.css';
import queuelyLogo from '../../assets/queuelylogo.png';

const BarberShopInfoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('barbers');
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format country code to full location
  const getLocationFromCountry = (countryCode) => {
    const countryMap = {
      'US': 'United States',
      'UK': 'United Kingdom',
      'CA': 'Canada',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'ES': 'Spain',
      'IT': 'Italy',
      'JP': 'Japan',
      'CN': 'China',
      'BR': 'Brazil',
      'MX': 'Mexico',
      'IN': 'India',
      'NG': 'Nigeria',
      'ZA': 'South Africa',
    };
    return countryMap[countryCode] || countryCode;
  };

  // Function to get coordinates for map center based on country
  const getCountryCoordinates = (countryCode) => {
    const coordMap = {
      'US': { lat: 37.0902, lng: -95.7129, zoom: 4 },
      'UK': { lat: 55.3781, lng: -3.4360, zoom: 6 },
      'CA': { lat: 56.1304, lng: -106.3468, zoom: 4 },
      'AU': { lat: -25.2744, lng: 133.7751, zoom: 4 },
      'DE': { lat: 51.1657, lng: 10.4515, zoom: 6 },
      'FR': { lat: 46.2276, lng: 2.2137, zoom: 6 },
      'ES': { lat: 40.4637, lng: -3.7492, zoom: 6 },
      'IT': { lat: 41.8719, lng: 12.5674, zoom: 6 },
      'JP': { lat: 36.2048, lng: 138.2529, zoom: 5 },
      'CN': { lat: 35.8617, lng: 104.1954, zoom: 4 },
      'BR': { lat: -14.2350, lng: -51.9253, zoom: 4 },
      'MX': { lat: 23.6345, lng: -102.5528, zoom: 5 },
      'IN': { lat: 20.5937, lng: 78.9629, zoom: 5 },
      'NG': { lat: 9.0820, lng: 8.6753, zoom: 6 },
      'ZA': { lat: -30.5595, lng: 22.9375, zoom: 5 },
    };
    return coordMap[countryCode] || { lat: 0, lng: 0, zoom: 2 };
  };

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await apiCall('GET', `/business/${id}`);
        if (response.data.success) {
          setBusinessData(response.data.data);
        } else {
          setError('Failed to load business details');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching business details:', error);
        setError('Failed to load business details');
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('token-changed'));
    navigate('/login');
  };

  const handleRegisterBusiness = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/business-register';
  };

  const handleBack = () => {
    navigate('/homepage');
  };

  if (loading) {
    return (
      <div className="barbershop-info-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !businessData) {
    return (
      <div className="barbershop-info-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>{error || 'Business not found'}</p>
        </div>
      </div>
    );
  }

  const { business, barbers, services } = businessData;
  const bannerImage = business.profileImage
    ? `http://localhost:5000/${business.profileImage}`
    : null;
  const fullLocation = getLocationFromCountry(business.country);
  const coordinates = getCountryCoordinates(business.country);

  // Generate Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(fullLocation)}&zoom=${coordinates.zoom}`;


  return (
    <div className="barbershop-info-page">
      {/* Header */}
      <header className="info-header">
        <div className="info-header-content">
          <div className="info-header-left">
            <button className="info-back-button" onClick={handleBack}>
              <ArrowLeft size={24} />
            </button>
            <div className="info-logo">
              <img src={queuelyLogo} alt="Queuely Logo" style={{ width: '50px', height: '50px' }} />
              <h1>QUEUELY</h1>
            </div>
          </div>
          <div className="info-header-right">
            <button onClick={handleLogout} className="btn-outline-info">
              Log Out
            </button>
            <button onClick={handleRegisterBusiness} className="btn-primary-info">
              Register Your Business
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="info-main">
        <div className="info-container">
          <div className="info-left-section">
            {/* Banner Image */}
            <div className="banner-container">
              {bannerImage ? (
                <img src={bannerImage} alt={business.shopName} className="banner-image" />
              ) : (
                <div className="banner-placeholder" style={{ backgroundColor: '#8B4513' }}></div>
              )}
            </div>

            {/* Business Name */}
            <div className="business-header">
              <h2 className="business-name">{business.shopName}</h2>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'barbers' ? 'active' : ''}`}
                onClick={() => setActiveTab('barbers')}
              >
                Barbers
              </button>
              <button
                className={`tab ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                Services
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Barbers Tab */}
              {activeTab === 'barbers' && (
                <div className="barbers-section">
                  <h3 className="section-title">Barbers</h3>
                  <div className="barbers-grid">
                    {barbers.length === 0 ? (
                      <p>No barbers available</p>
                    ) : (
                      barbers.map((barber) => (
                        <BarberCard key={barber.barber_id} barber={barber} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div className="services-section">
                  <div className="services-header">
                    <h3 className="section-title">Services</h3>
                    <button className="show-all-link">Show all {services.length} services</button>
                  </div>
                  <div className="services-list">
                    {services.length === 0 ? (
                      <p>No services available</p>
                    ) : (
                      services.slice(0, 4).map((service) => (
                        <ServiceCard key={service.service_id} service={service} />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="info-right-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-icon">
                <MapPin size={40} />
              </div>
              <h3 className="sidebar-business-name">{business.shopName}</h3>
              {/* Map Display */}
              <div className="sidebar-map">
                <iframe
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapUrl}
                  title="Business Location Map"
                ></iframe>
              </div>

              <p className="sidebar-address">
                <span style={{ display: 'inline', marginRight: '4px' }}>{fullLocation}</span>
                {business.country}
              </p>

              <div className="sidebar-actions">
                <button className="icon-button">
                  <MapPin size={20} />
                </button>
                <button className="icon-button">
                  <Phone size={20} />
                </button>
              </div>

              <button className="book-now-button" onClick={() => navigate(`/book/${id}`)}>
                <Calendar size={20} />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Barber Card Component
const BarberCard = ({ barber }) => {
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRatingDisplay = () => {
    // Placeholder rating calculation
    return '5.0';
  };

  return (
    <div className="barber-card">
      <div className="barber-avatar">
        {getInitials(barber.name)}
      </div>
      <div className="barber-info">
        <div className="barber-rating">
          <span className="barber-rating-number">{getRatingDisplay()}</span>
          <span className="barber-review-count">({Math.floor(Math.random() * 50) + 10})</span>
        </div>
        <h4 className="barber-name">{barber.name}</h4>
        <p className={`barber-status ${barber.status === 'ACTIVE' ? 'available' : 'unavailable'}`}>
          {barber.status === 'ACTIVE' ? 'Available Today' : 'Unavailable'}
        </p>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-info">
        <h4 className="service-name">{service.name}</h4>
        <p className="service-duration">All • {service.duration} mins</p>
      </div>
      <div className="service-price">${service.price}</div>
    </div>
  );
};

export default BarberShopInfoPage;
