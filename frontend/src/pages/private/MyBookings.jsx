import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronLeft } from 'lucide-react';
import { apiCall } from '../../utils/api';
import ReviewModal from '../../components/ReviewModal';
import useAuth from '../../hooks/useAuth';
import '../../styles/homepage.css'; // Reuse homepage styles for now

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await apiCall('GET', '/bookings/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setBookings(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            setLoading(false);
        }
    };

    const handleLeaveReview = (booking) => {
        setSelectedBooking(booking);
        setReviewModalOpen(true);
    };

    return (
        <div className="homepage" style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <header className="header">
                <div className="header-content">
                    <div className="logo" onClick={() => navigate('/homepage')}>
                        <h1 style={{ letterSpacing: '-0.8px' }}>Queuely</h1>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="title-section" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                        <button onClick={() => navigate('/homepage')} style={{
                            background: 'none', border: 'none', color: '#666',
                            display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                            fontSize: '14px', padding: 0
                        }}>
                            <ChevronLeft size={16} /> Back to Browse
                        </button>
                        <h2 className="page-title">My Bookings</h2>
                        <p className="subtitle">Manage your appointments and reviews</p>
                    </div>

                    <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {loading ? (
                            <p>Loading bookings...</p>
                        ) : bookings.length === 0 ? (
                            <div className="no-results" style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px' }}>
                                <p>No bookings found.</p>
                                <button onClick={() => navigate('/homepage')} style={{
                                    marginTop: '16px', padding: '10px 20px',
                                    background: '#2563eb', color: 'white', border: 'none',
                                    borderRadius: '8px', fontWeight: 600, cursor: 'pointer'
                                }}>
                                    Find a Barber
                                </button>
                            </div>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking.booking_id} className="booking-card" style={{
                                    background: 'white', padding: '24px', borderRadius: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex',
                                    justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
                                }}>
                                    <div className="booking-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>{booking.barber}</h3>
                                            <span className={`status-badge ${booking.status.toLowerCase()}`} style={{
                                                fontSize: '11px', padding: '4px 8px', borderRadius: '6px', fontWeight: 700,
                                                backgroundColor: booking.status === 'COMPLETED' ? '#ecfdf5' : '#eff6ff',
                                                color: booking.status === 'COMPLETED' ? '#059669' : '#2563eb'
                                            }}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p style={{ margin: '0 0 8px 0', color: '#4b5563', fontWeight: 500 }}>{booking.service}</p>
                                        <div style={{ display: 'flex', gap: '16px', color: '#6b7280', fontSize: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={14} />
                                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} />
                                                <span>{booking.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="booking-actions">
                                        {booking.status === 'COMPLETED' && (
                                            !booking.Review ? (
                                                <button
                                                    onClick={() => handleLeaveReview(booking)}
                                                    style={{
                                                        padding: '10px 16px', background: '#2563eb', color: 'white',
                                                        border: 'none', borderRadius: '8px', fontWeight: 600,
                                                        cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s'
                                                    }}
                                                >
                                                    Leave a Review
                                                </button>
                                            ) : (
                                                <div style={{
                                                    padding: '8px 12px', background: '#f3f4f6', color: '#6b7280',
                                                    borderRadius: '8px', fontWeight: 600, fontSize: '13px',
                                                    border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                    <span>★</span> Reviewed
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {reviewModalOpen && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    booking={selectedBooking}
                    onClose={() => setReviewModalOpen(false)}
                    onSuccess={() => {
                        fetchBookings();
                        setReviewModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default MyBookings;
