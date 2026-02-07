// frontend/src/pages/private/BusinessDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Scissors,
    Users,
    Menu,
    X,
    TrendingUp,
    EllipsisVertical,
    Moon,
    Sun,
    CircleHelp,
    Plus,
    ShoppingBag
} from 'lucide-react';
import { apiCall } from '../../utils/api';
import AddServiceBarberModal from '../../components/AddServiceBarberModal';
import EditServiceModal from '../../components/EditServiceModal';
import BusinessProfile from '../../components/BusinessProfile';
import '../../styles/businessDashboard.css';

const BusinessDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [modalTab, setModalTab] = useState('service');
    const [stats, setStats] = useState({
        serviceRevenue: '0.00',
        totalBookings: 0,
        totalServices: 0,
        totalBarbers: 0
    });
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeView, setActiveView] = useState('overview');
    const [allBookings, setAllBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [barbers, setBarbers] = useState([]);

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    const handleEditService = (service) => {
        setSelectedService(service);
        setEditModalOpen(true);
    };

    const handleOpenAddModal = (tab) => {
        setModalTab(tab);
        setModalOpen(true);
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

    const formatDate = (dateString, timeString) => {
        // Assume dateString is YYYY-MM-DD
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }) + `, ${timeString}`;
    };

    // If it's the very first load (overview), we can show the full page loader
    // But subsequently, we want to keep the layout visible
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await fetchDashboardData();
            setInitialLoading(false);
        };
        init();
    }, []);

    if (initialLoading) {
        return (
            <div className="dashboard-initial-loader">
                <div className="loader-orbit"></div>
            </div>
        );
    }

    return (
        <div className={`business-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
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
                    <div className="logo-text">
                        <h1 style={{ letterSpacing: '-0.8px' }}>Queuely</h1>
                        <p>BUSINESS MANAGER</p>
                    </div>
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
                </nav>

                <div className="sidebar-footer">
                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span>Switch Theme</span>
                    </button>
                    <div className="sidebar-user" onClick={() => setActiveView('profile')}>
                        <div className="user-avatar">
                            {user.firstName?.charAt(0) || 'A'}
                        </div>
                        <div className="user-info">
                            <h4>{user.firstName || 'Admin'}</h4>
                            <p onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                            }}>Logout</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {loading && (
                    <div className="view-loader-overlay">
                        <div className="view-loader-spinner"></div>
                    </div>
                )}
                {activeView === 'overview' && (
                    <>
                        <div className="dashboard-header">
                            <div className="dashboard-title-section">
                                <h1>Business Dashboard</h1>
                                <p>Welcome back, {user.firstName || user.shopName}. Here's what's happening today.</p>
                            </div>
                            <div className="help-button">
                                <CircleHelp size={24} />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon blue">
                                    <ShoppingBag size={22} />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Service Sales</p>
                                    <h2 className="stat-value">${stats.serviceRevenue}</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon purple">
                                    <Calendar size={22} />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Bookings</p>
                                    <h2 className="stat-value">{stats.totalBookings}</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon green">
                                    <Scissors size={22} />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Services</p>
                                    <h2 className="stat-value">{stats.totalServices}</h2>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon orange">
                                    <Users size={22} />
                                </div>
                                <div className="stat-info">
                                    <p className="stat-label">Barbers</p>
                                    <h2 className="stat-value">{stats.totalBarbers}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Recent Bookings */}
                        <div className="bookings-section shadow-premium">
                            <div className="bookings-header">
                                <h2>Recent Bookings</h2>
                                <button className="view-all-link" onClick={() => setActiveView('appointments')}>View all</button>
                            </div>

                            <div className="table-container">
                                <table className="bookings-table">
                                    <thead>
                                        <tr>
                                            <th>CUSTOMER</th>
                                            <th>SERVICE</th>
                                            <th>BARBER</th>
                                            <th>DATE & TIME</th>
                                            <th>AMOUNT</th>
                                            <th>STATUS</th>
                                            <th>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                                                    No recent bookings
                                                </td>
                                            </tr>
                                        ) : (
                                            bookings.map((booking) => (
                                                <tr key={booking.booking_id}>
                                                    <td>
                                                        <div className="customer-cell">
                                                            <div className="customer-avatar-img">
                                                                {booking.customer_name.charAt(0)}
                                                            </div>
                                                            <div className="customer-info-main">
                                                                <h4>{booking.customer_name}</h4>
                                                                <p>{booking.customer_email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{booking.service}</td>
                                                    <td>
                                                        <div className="barber-cell">
                                                            <div className="barber-avatar-sm">
                                                                {booking.barber.charAt(0)}
                                                            </div>
                                                            <span>{booking.barber}</span>
                                                        </div>
                                                    </td>
                                                    <td>{formatDate(booking.date, booking.time)}</td>
                                                    <td className="amount-cell">${parseFloat(booking.amount).toFixed(2)}</td>
                                                    <td>
                                                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-cell">
                                                            {booking.status === 'PENDING' ? (
                                                                <div className="quick-actions">
                                                                    <button className="btn-tick" onClick={() => handleBookingAction(booking.booking_id, 'ACCEPTED')}>✓</button>
                                                                    <button className="btn-cross" onClick={() => handleBookingAction(booking.booking_id, 'DECLINED')}>✕</button>
                                                                </div>
                                                            ) : (
                                                                <EllipsisVertical size={18} className="more-btn" />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeView === 'appointments' && (
                    <div className="bookings-section shadow-premium">
                        <div className="bookings-header">
                            <h2>All Appointments</h2>
                        </div>
                        <div className="table-container">
                            <table className="bookings-table">
                                <thead>
                                    <tr>
                                        <th>CUSTOMER</th>
                                        <th>SERVICE</th>
                                        <th>BARBER</th>
                                        <th>DATE & TIME</th>
                                        <th>AMOUNT</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                                                No appointments found
                                            </td>
                                        </tr>
                                    ) : (
                                        allBookings.map((booking) => (
                                            <tr key={booking.booking_id}>
                                                <td>
                                                    <div className="customer-cell">
                                                        <div className="customer-avatar-img">
                                                            {booking.customer_name.charAt(0)}
                                                        </div>
                                                        <div className="customer-info-main">
                                                            <h4>{booking.customer_name}</h4>
                                                            <p>{booking.customer_email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{booking.service}</td>
                                                <td>{booking.barber}</td>
                                                <td>{formatDate(booking.date, booking.time)}</td>
                                                <td className="amount-cell">${parseFloat(booking.amount).toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <EllipsisVertical size={18} className="more-btn" />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeView === 'services' && (
                    <div className="services-view">
                        <div className="view-header">
                            <h2>Services</h2>
                            <button className="btn-add-premium" onClick={() => handleOpenAddModal('service')}>
                                <Plus size={18} /> Add Service
                            </button>
                        </div>
                        <div className="services-grid-premium">
                            {services.map(service => (
                                <div key={service.service_id} className="service-card-premium">
                                    <div className="card-top">
                                        <h3>{service.name}</h3>
                                        <span className="price-badge">${parseFloat(service.price).toFixed(2)}</span>
                                    </div>
                                    <p className="duration-text">{service.duration} mins</p>
                                    <p className="description-text">{service.description || 'Professional grooming service tailored to your style.'}</p>
                                    <div className="card-footer">
                                        <button
                                            className="btn-edit-sm"
                                            onClick={() => handleEditService(service)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === 'barbers' && (
                    <div className="barbers-view">
                        <div className="view-header">
                            <h2>Barbers</h2>
                            <button className="btn-add-premium" onClick={() => handleOpenAddModal('barber')}>
                                <Plus size={18} /> Add Barber
                            </button>
                        </div>
                        <div className="barbers-grid-premium">
                            {barbers.map(barber => (
                                <div key={barber.barber_id} className="barber-card-premium">
                                    <div className="barber-avatar-lg">
                                        {barber.name.charAt(0)}
                                    </div>
                                    <h3>{barber.name}</h3>
                                    <p className="spec-text">{barber.specialization || 'Master Barber'}</p>
                                    <div className="barber-stats-row">
                                        <span className="exp-tag">{barber.experience || 0} Yrs Exp.</span>
                                        <span className={`status-dot ${barber.status?.toLowerCase() || 'active'}`}></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeView === 'profile' && (
                    <BusinessProfile onProfileUpdate={refreshUser} />
                )}

                {/* Edit Service Modal */}
                <EditServiceModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedService(null);
                    }}
                    onSuccess={() => {
                        fetchServices();
                        if (activeView === 'overview') fetchDashboardData();
                    }}
                    service={selectedService}
                />

                {/* Add Service/Barber Modal */}
                <AddServiceBarberModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={() => {
                        if (activeView === 'overview') fetchDashboardData();
                        if (activeView === 'services') fetchServices();
                        if (activeView === 'barbers') fetchBarbers();
                    }}
                    initialTab={modalTab}
                />
            </main >
            <div className={`floating-help ${isDarkMode ? 'dark' : ''}`}>
                <CircleHelp size={24} color="white" />
            </div>
        </div >
    );
};

export default BusinessDashboard;
