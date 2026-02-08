import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Phone, Calendar } from 'lucide-react';
import { apiCall } from '../../utils/api';
import { countries } from '../../utils/countries';
import '../../styles/barbershopinfo.css';

const BarberShopInfoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('barbers');
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format country code to full location
  const getLocationFromCountry = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
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
  // If business is in Nepal and has localLocation, use that for a zoomed-in view
  let mapLocation = fullLocation;
  let mapZoom = coordinates.zoom;

  if (business.country === 'NP' && business.localLocation) {
    // Use local location for Nepal businesses (e.g., "Kathmandu, Nepal")
    mapLocation = `${business.localLocation}, Nepal`;
    mapZoom = 13; // City-level zoom for local locations
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(mapLocation)}&zoom=${mapZoom}`;


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
              <h1 style={{ letterSpacing: '-0.8px' }}>Queuely</h1>
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
            <div className="sidebar-card" style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
              border: '1px solid #F3F4F6',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <MapPin size={20} color="#2563eb" />
                Location
              </h3>

              {/* Map Display */}
              <div style={{
                marginBottom: '20px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <iframe
                  width="100%"
                  height="180"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapUrl}
                  title="Business Location Map"
                ></iframe>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <p style={{
                  fontSize: '15px',
                  color: '#4B5563',
                  fontWeight: '500',
                  lineHeight: '1.5',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px'
                }}>
                  {business.country === 'NP' && business.localLocation ? (
                    <>
                      <span>{business.localLocation}, {fullLocation}</span>
                    </>
                  ) : (
                    <>
                      <span>{fullLocation}, {business.country}</span>
                    </>
                  )}
                </p>
              </div>

              <div style={{
                padding: '20px 0',
                borderTop: '1px solid #F3F4F6',
                borderBottom: '1px solid #F3F4F6',
                marginBottom: '25px'
              }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
                  Contact Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(37, 99, 235, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Phone size={18} color="#2563eb" />
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, fontWeight: '600' }}>Phone</p>
                      <p style={{ fontSize: '14px', color: '#111827', margin: 0, fontWeight: '700' }}>{business.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {business.businessFocus && Array.isArray(business.businessFocus) && business.businessFocus.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
                    Shop Specialties
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {business.businessFocus.map(focus => (
                      <span key={focus} style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        backgroundColor: '#F9FAFB',
                        color: '#1F2937',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: '1px solid #E5E7EB',
                        transition: 'all 0.2s ease',
                      }}>
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="book-now-button"
                onClick={() => navigate(`/book/${id}`)}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s ease'
                }}
              >
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
