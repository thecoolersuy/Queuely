// frontend/src/pages/private/BusinessDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Users,
    Package,
    BarChart3,
    Menu,
    X,
    DollarSign,
    Briefcase,
    TrendingUp,
    MoreVertical,
    Palette,
    Sparkles,
    Droplets,
    Zap,
    Crown,
    Brush,
    Building
} from 'lucide-react';
import { apiCall } from '../../utils/api';
import AddServiceBarberModal from '../../components/AddServiceBarberModal';
import BusinessProfile from '../../components/BusinessProfile';
import '../../styles/businessDashboard.css'; // Keep this style file, but you might need to update it for buttons in nav
import queuelyLogo from '../../assets/queuelylogo.png';

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [stats, setStats] = useState({
        serviceRevenue: '0.00',
        totalBookings: 0,
        totalServices: 0,
        totalNetSales: '0.00',
        totalBarbers: 0
    });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeView, setActiveView] = useState('overview');
    const [allBookings, setAllBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

    const refreshUser = () => {
        setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    };

    useEffect(() => {
        if (activeView === 'overview') {
            fetchDashboardData();
        } else if (activeView === 'appointments') {
            fetchAppointments();
        } else if (activeView === 'services') {
            fetchServices();
        } else if (activeView === 'barbers') {
            fetchBarbers();
        }
    }, [activeView]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await apiCall('GET', '/business-dashboard/all-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllBookings(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await apiCall('GET', '/services', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setLoading(false);
        }
    };

    const fetchBarbers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await apiCall('GET', '/barbers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBarbers(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching barbers:', error);
            setLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const statsResponse = await apiCall('GET', '/business-dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const bookingsResponse = await apiCall('GET', '/business-dashboard/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStats(statsResponse.data.data);
            setBookings(bookingsResponse.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const handleBookingAction = async (bookingId, status) => {
        try {
            const token = localStorage.getItem('token');
            await apiCall('PATCH', `/business-dashboard/bookings/${bookingId}/status`, {
                data: { status },
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh bookings
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('token-changed'));
        navigate('/business-login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="business-dashboard">
            {/* Hamburger Menu */}
            <button
                className="hamburger-menu"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="sidebar-logo-top">
                        <img src={queuelyLogo} alt="Queuely Logo" />
                        <span>QUEUELY</span>
                    </div>
                    <p>BUSINESS DASHBOARD</p>
                </div>

                <nav className="sidebar-nav">
                    <button onClick={() => setActiveView('overview')} className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}>
                        <LayoutDashboard className="nav-icon" />
                        <span>Overview</span>
                    </button>
                    <button onClick={() => setActiveView('appointments')} className={`nav-item ${activeView === 'appointments' ? 'active' : ''}`}>
                        <Calendar className="nav-icon" />
                        <span>Appointments</span>
                    </button>
                    <button onClick={() => setActiveView('services')} className={`nav-item ${activeView === 'services' ? 'active' : ''}`}>
                        <Scissors className="nav-icon" />
                        <span>Services</span>
                    </button>
                    <button onClick={() => setActiveView('barbers')} className={`nav-item ${activeView === 'barbers' ? 'active' : ''}`}>
                        <Users className="nav-icon" />
                        <span>Barbers</span>
                    </button>
                    <button onClick={() => setActiveView('profile')} className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}>
                        <Building className="nav-icon" />
                        <span>Business Profile</span>
                    </button>
                    <button onClick={() => setActiveView('reports')} className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}>
                        <BarChart3 className="nav-icon" />
                        <span>Reports</span>
                    </button>
                </nav>

                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user.name?.charAt(0) || 'B'}
                    </div>
                    <div className="user-info">
                        <h4>{user.shopName || 'Business'}</h4>
                        <p onClick={handleLogout} style={{ cursor: 'pointer', color: '#3b82f6' }}>
                            Logout
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {activeView === 'overview' && (
                    <>
                        <div className="dashboard-header">
                            <div className="dashboard-title-section">
                                <h1>Welcome back, {user.shopName || 'Business'}</h1>
                                <p>Here's what's happening today.</p>
                            </div>
                            <div className="dashboard-actions">
                                <button
                                    className="btn-secondary"
                                    onClick={() => setModalOpen(true)}>
                                    Add Barbers</button>
                                <button
                                    className="btn-primary-dashboard"
                                    onClick={() => setModalOpen(true)}
                                >
                                    Add Services
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon blue">
                                        <Users size={20} />
                                    </div>
                                    <p className="stat-label">Barbers</p>
                                </div>
                                <h2 className="stat-value">{stats.totalBarbers}</h2>
                                <p className="stat-change">
                                    <TrendingUp size={14} />
                                    Active
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon purple">
                                        <Calendar size={20} />
                                    </div>
                                    <p className="stat-label">Bookings</p>
                                </div>
                                <h2 className="stat-value">{stats.totalBookings}</h2>
                                <p className="stat-change">
                                    <TrendingUp size={14} />
                                    +8.3%
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon green">
                                        <Scissors size={20} />
                                    </div>
                                    <p className="stat-label">Services</p>
                                </div>
                                <h2 className="stat-value">{stats.totalServices}</h2>
                                <p className="stat-change">
                                    <TrendingUp size={14} />
                                    +5.2%
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-header">
                                    <div className="stat-icon orange">
                                        <Briefcase size={20} />
                                    </div>
                                    <p className="stat-label">Total Net Sales</p>
                                </div>
                                <h2 className="stat-value">${stats.totalNetSales}</h2>
                                <p className="stat-change">
                                    <TrendingUp size={14} />
                                    +15.8%
                                </p>
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        <div className="bookings-section">
                            <div className="bookings-header">
                                <h2>Recent Bookings</h2>
                                <button className="view-all-link" onClick={() => setActiveView('appointments')}>View all</button>
                            </div>

                            <table className="bookings-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Service</th>
                                        <th>Barber</th>
                                        <th>Date & Time</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                                No bookings yet
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map((booking) => (
                                            <tr key={booking.booking_id}>
                                                <td>
                                                    <div className="customer-cell">
                                                        <div className="customer-avatar">
                                                            {booking.customer_name.charAt(0)}
                                                        </div>
                                                        <div className="customer-info">
                                                            <h4>{booking.customer_name}</h4>
                                                            <p>{booking.customer_email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{booking.service}</td>
                                                <td>{booking.barber}</td>
                                                <td>{formatDate(booking.date)} {booking.time}</td>
                                                <td>${parseFloat(booking.amount).toFixed(2)}</td>
                                                <td>
                                                    <span className={`booking-status ${booking.status.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {booking.status === 'PENDING' ? (
                                                        <div className="booking-actions">
                                                            <button
                                                                className="btn-accept"
                                                                onClick={() => handleBookingAction(booking.booking_id, 'ACCEPTED')}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                className="btn-decline"
                                                                onClick={() => handleBookingAction(booking.booking_id, 'DECLINED')}
                                                            >
                                                                Decline
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button className="btn-more">
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeView === 'appointments' && (
                    <div className="bookings-section">
                        <div className="bookings-header">
                            <h2>All Appointments</h2>
                        </div>
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Barber</th>
                                    <th>Date & Time</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                            No appointments found
                                        </td>
                                    </tr>
                                ) : (
                                    allBookings.map((booking) => (
                                        <tr key={booking.booking_id}>
                                            <td>
                                                <div className="customer-cell">
                                                    <div className="customer-avatar">
                                                        {booking.customer_name.charAt(0)}
                                                    </div>
                                                    <div className="customer-info">
                                                        <h4>{booking.customer_name}</h4>
                                                        <p>{booking.customer_email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{booking.service}</td>
                                            <td>{booking.barber}</td>
                                            <td>{formatDate(booking.date)} {booking.time}</td>
                                            <td>${parseFloat(booking.amount).toFixed(2)}</td>
                                            <td>
                                                <span className={`booking-status ${booking.status.toLowerCase()}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>
                                                {booking.status === 'PENDING' ? (
                                                    <div className="booking-actions">
                                                        <button
                                                            className="btn-accept"
                                                            onClick={() => handleBookingAction(booking.booking_id, 'ACCEPTED')}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="btn-decline"
                                                            onClick={() => handleBookingAction(booking.booking_id, 'DECLINED')}
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#888', fontSize: '14px' }}>
                                                        {booking.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeView === 'services' && (
                    <div className="services-section">
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ color: 'black' }}>Services</h2>
                            <button className="btn-primary-dashboard" onClick={() => setModalOpen(true)}>Add Service</button>
                        </div>
                        <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {services.map(service => (
                                <div key={service.service_id} className="service-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <h3 style={{ color: '#1a1a1a', margin: 0, fontSize: '18px', fontWeight: '600' }}>{service.name}</h3>
                                        <span style={{ fontWeight: '600', color: '#111', backgroundColor: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontSize: '14px' }}>${parseFloat(service.price).toFixed(2)}</span>
                                    </div>
                                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>{service.duration} mins • {service.description || 'No description'}</p>
                                    <div style={{ paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button className="btn-more" style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === 'barbers' && (
                    <div className="barbers-section">
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ color: 'black' }}>Barbers</h2>
                            <button className="btn-primary-dashboard" onClick={() => setModalOpen(true)}>Add Barber</button>
                        </div>
                        <div className="barbers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            {barbers.map(barber => (
                                <div key={barber.barber_id} className="barber-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                                    <div className="barber-avatar" style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '600', color: '#2563eb' }}>
                                        {barber.name.charAt(0)}
                                    </div>
                                    <h3 style={{ color: 'black', fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>{barber.name}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>{barber.specialization || 'General Barber'}</p>
                                    <div className="barber-stats" style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '14px', color: '#4b5563' }}>
                                        <span>{barber.experience || 0} Years Exp.</span>
                                        <span className={`status-badge ${barber.status?.toLowerCase() || 'active'}`} style={{ color: barber.status === 'ACTIVE' ? '#16a34a' : '#9ca3af' }}>{barber.status || 'Active'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeView === 'profile' && (
                    <BusinessProfile onProfileUpdate={refreshUser} />
                )}

                {activeView === 'reports' && (
                    <div className="dashboard-header">
                        <h1>Reports</h1>
                        <p>Analytics and reports coming soon.</p>
                    </div>
                )}

                {/* Add Service/Barber Modal */}
                <AddServiceBarberModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        // Refresh data based on active view
                        if (activeView === 'overview') fetchDashboardData();
                        if (activeView === 'services') fetchServices();
                        if (activeView === 'barbers') fetchBarbers();
                    }}
                />
            </main >
        </div >
    );
};

export default BusinessDashboard;