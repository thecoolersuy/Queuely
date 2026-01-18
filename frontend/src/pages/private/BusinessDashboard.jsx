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
    MoreVertical
} from 'lucide-react';
import { apiCall } from '../../utils/api';
import AddServiceBarberModal from '../../components/AddServiceBarberModal';
import '../../styles/businessDashboard.css';

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [stats, setStats] = useState({
        serviceRevenue: '0.00',
        totalBookings: 0,
        totalServices: 0,
        totalNetSales: '0.00'
    });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch stats
            const statsResponse = await apiCall('GET', '/business-dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch bookings
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Loading...
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
                    QUEUELY
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>BUSINESS DASHBOARD</p>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active">
                        <LayoutDashboard className="nav-icon" />
                        <span>Overview</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Calendar className="nav-icon" />
                        <span>Appointments</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Scissors className="nav-icon" />
                        <span>Services</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Users className="nav-icon" />
                        <span>Barbers</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Package className="nav-icon" />
                        <span>Inventory</span>
                    </a>
                    <a href="#" className="nav-item">
                        <BarChart3 className="nav-icon" />
                        <span>Reports</span>
                    </a>
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
                {/* Header */}
                <div className="dashboard-header">
                    <div className="dashboard-title-section">
                        <h1>Business Dashboard</h1>
                        <p>Welcome back, here's what's happening today.</p>
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
                                <DollarSign size={20} />
                            </div>
                            <p className="stat-label">Service Revenue</p>
                        </div>
                        <h2 className="stat-value">${stats.serviceRevenue}</h2>
                        <p className="stat-change">
                            <TrendingUp size={14} />
                            +12.5%
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
                        <a href="#" className="view-all-link">View all</a>
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

                {/* Add Service/Barber Modal */}
                <AddServiceBarberModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        fetchDashboardData(); // Refresh dashboard data
                    }}
                />
            </main>
        </div>
    );
};

export default BusinessDashboard;