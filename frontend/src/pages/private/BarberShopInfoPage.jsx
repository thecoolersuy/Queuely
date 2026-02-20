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

  const getLocationFromCountry = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

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
      'NP': { lat: 28.3949, lng: 84.1240, zoom: 7 },
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
      } catch (err) {
        console.error('Error fetching business details:', err);
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

  const {
    business,
    barbers,
    services,
    reviews = [],
    rating = '0.0',
    reviewCount = 0
  } = businessData;

  const bannerImage = business.profileImage
    ? `http://localhost:5000/${business.profileImage}`
    : null;

  const fullLocation = getLocationFromCountry(business.country);
  const coordinates = getCountryCoordinates(business.country);

  let mapLocation = fullLocation;
  let mapZoom = coordinates.zoom;
  if (business.country === 'NP' && business.localLocation) {
    mapLocation = `${business.localLocation}, Nepal`;
    mapZoom = 13;
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(mapLocation)}&zoom=${mapZoom}`;

  const roundedRating = Math.round(parseFloat(rating));

  return (
    <div className="barbershop-info-page">
      {/* ── Header ── */}
      <header className="info-header">
        <div className="info-header-content">
          <div className="info-header-left">
            <button className="info-back-button" onClick={() => navigate('/homepage')}>
              <ArrowLeft size={24} />
            </button>
            <div className="info-logo">
              <h1 style={{ letterSpacing: '-0.8px' }}>Queuely</h1>
            </div>
          </div>
          <div className="info-header-right">
            <button onClick={handleLogout} className="btn-outline-info">Log Out</button>
            <button onClick={handleRegisterBusiness} className="btn-primary-info">Register Your Business</button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="info-main">
        <div className="info-container">

          {/* Left Section */}
          <div className="info-left-section">
            <div className="banner-container">
              {bannerImage
                ? <img src={bannerImage} alt={business.shopName} className="banner-image" />
                : <div className="banner-placeholder" style={{ backgroundColor: '#8B4513' }} />}
            </div>

            <div className="business-header">
              <h2 className="business-name">{business.shopName}</h2>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {['barbers', 'services', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'reviews' ? `Reviews (${reviewCount})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'barbers' && (
                <div className="barbers-section">
                  <h3 className="section-title">Barbers</h3>
                  <div className="barbers-grid">
                    {barbers.length === 0
                      ? <p>No barbers available</p>
                      : barbers.map((barber) => <BarberCard key={barber.barber_id} barber={barber} />)}
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="services-section">
                  <div className="services-header">
                    <h3 className="section-title">Services</h3>
                    <button className="show-all-link">Show all {services.length} services</button>
                  </div>
                  <div className="services-list">
                    {services.length === 0
                      ? <p>No services available</p>
                      : services.slice(0, 4).map((service) => <ServiceCard key={service.service_id} service={service} />)}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-section">
                  <h3 className="section-title">Customer Reviews</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                    {reviews.length === 0
                      ? <p style={{ color: '#888' }}>No reviews yet. Be the first to leave one!</p>
                      : reviews.map((review) => <ReviewCard key={review.review_id} review={review} />)}
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
            }}>



              {/* Location heading */}
              <h3 style={{
                fontSize: '18px', fontWeight: '800', color: '#111827',
                marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <MapPin size={20} color="#2563eb" />
                Location
              </h3>

              {/* Map */}
              <div style={{
                marginBottom: '16px', borderRadius: '16px', overflow: 'hidden',
                border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <iframe
                  width="100%" height="180" style={{ border: 0 }}
                  loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade"
                  src={mapUrl} title="Business Location Map"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '15px', color: '#4B5563', fontWeight: '500' }}>
                  {business.country === 'NP' && business.localLocation
                    ? `${business.localLocation}, ${fullLocation}`
                    : `${fullLocation}, ${business.country}`}
                </p>
              </div>

              {/* Contact */}
              <div style={{
                padding: '16px 0', borderTop: '1px solid #F3F4F6',
                borderBottom: '1px solid #F3F4F6', marginBottom: '20px'
              }}>
                <h4 style={{
                  fontSize: '11px', fontWeight: '800', color: '#9CA3AF',
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px'
                }}>
                  Contact Information
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    backgroundColor: 'rgba(37,99,235,0.05)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Phone size={18} color="#2563eb" />
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, fontWeight: '600' }}>Phone</p>
                    <p style={{ fontSize: '14px', color: '#111827', margin: 0, fontWeight: '700' }}>{business.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              {Array.isArray(business.businessFocus) && business.businessFocus.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    fontSize: '11px', fontWeight: '800', color: '#9CA3AF',
                    textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px'
                  }}>
                    Shop Specialties
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {business.businessFocus.map(focus => (
                      <span key={focus} style={{
                        padding: '7px 12px', borderRadius: '10px',
                        backgroundColor: '#F9FAFB', color: '#1F2937',
                        fontSize: '12px', fontWeight: '600', border: '1px solid #E5E7EB',
                      }}>
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Book Now */}
              <button
                className="book-now-button"
                onClick={() => navigate(`/book/${id}`)}
                style={{
                  width: '100%', padding: '16px', backgroundColor: '#2563eb',
                  color: 'white', borderRadius: '16px', fontSize: '16px',
                  fontWeight: '800', border: 'none', cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(37,99,235,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', transition: 'all 0.2s ease'
                }}
              >
                <Calendar size={20} />
                Book Now
              </button>

              {/* Sidebar Reviews Preview */}
              {reviews.length > 0 && (
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F3F4F6' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Recent Reviews
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reviews.slice(0, 2).map(review => (
                      <div key={review.review_id} style={{ fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700', color: '#1F2937' }}>{review.user_name || 'Anonymous'}</span>
                          <div style={{ display: 'flex', gap: '1px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < review.rating ? "#f59e0b" : "none"} color={i < review.rating ? "#f59e0b" : "#d1d5db"} />
                            ))}
                          </div>
                        </div>
                        <p style={{ margin: 0, color: '#4B5563', lineHeight: '1.5', fontStyle: 'italic' }}>
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                  {reviews.length > 2 && (
                    <button
                      onClick={() => setActiveTab('reviews')}
                      style={{
                        marginTop: '16px', border: 'none', background: 'none',
                        color: '#2563eb', fontSize: '13px', fontWeight: '700',
                        cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      View all {reviewCount} reviews
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// ── Barber Card ──
const BarberCard = ({ barber }) => {
  const getInitials = (name) => {
    const parts = name.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="barber-card">
      <div className="barber-avatar">{getInitials(barber.name)}</div>
      <div className="barber-info">
        <h4 className="barber-name">{barber.name}</h4>
        <p className={`barber-status ${barber.status === 'ACTIVE' ? 'available' : 'unavailable'}`}>
          {barber.status === 'ACTIVE' ? 'Available Today' : 'Unavailable'}
        </p>
      </div>
    </div>
  );
};

// ── Service Card ──
const ServiceCard = ({ service }) => (
  <div className="service-card">
    <div className="service-info">
      <h4 className="service-name">{service.name}</h4>
      <p className="service-duration">All • {service.duration} mins</p>
    </div>
    <div className="service-price">${service.price}</div>
  </div>
);

// ── Review Card ──
const ReviewCard = ({ review }) => (
  <div style={{
    backgroundColor: 'white', borderRadius: '14px', padding: '20px',
    border: '1px solid #f3f4f6', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontWeight: '700', fontSize: '14px', color: '#4b5563'
        }}>
          {review.user_name ? review.user_name.charAt(0).toUpperCase() : '?'}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#111827' }}>{review.user_name || 'Anonymous'}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
            {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      {/* Star rating */}
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={15}
            fill={star <= review.rating ? '#f59e0b' : 'none'}
            color={star <= review.rating ? '#f59e0b' : '#e5e7eb'}
            strokeWidth={1.5}
          />
        ))}
      </div>
    </div>
    {review.comment && (
      <p style={{ margin: 0, color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
        {review.comment}
      </p>
    )}
  </div>
);

export default BarberShopInfoPage;
