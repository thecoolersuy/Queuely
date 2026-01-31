import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiCall } from '../../utils/api';
import queuelyLogo from '../../assets/queuelylogo.png';
import '../../styles/booking.css';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // States
    const [businessData, setBusinessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);

    // Mock time slots for now (would ideally fetch based on barber/date)
    const timeSlots = [
        "10:00am", "10:30am", "11:00am", "11:30am", "12:00pm",
        "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm",
        "3:00pm", "3:30pm", "4:00pm", "4:30pm", "7:30pm"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiCall('GET', `/business/${id}`);
                if (response.data.success) {
                    setBusinessData(response.data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching booking data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const toggleService = (service) => {
        setSelectedServices(prev => {
            const isSelected = prev.find(s => s.service_id === service.service_id);
            if (isSelected) {
                return prev.filter(s => s.service_id !== service.service_id);
            } else {
                return [...prev, service];
            }
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('token-changed'));
        navigate('/login');
    };

    const calculateTotal = () => {
        return selectedServices.reduce((acc, curr) => acc + parseFloat(curr.price), 0).toFixed(2);
    };

    const calculateDuration = () => {
        return selectedServices.reduce((acc, curr) => acc + parseInt(curr.duration), 0);
    };

    // Generate next 14 days for date picker
    const getDates = () => {
        const dates = [];
        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const formatDateShort = (date) => {
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        return {
            day: days[date.getDay()],
            num: date.getDate()
        };
    };

    if (loading) return <div className="booking-loading">Loading...</div>;
    if (!businessData) return <div className="booking-error">Barbershop not found</div>;

    const { business, services, barbers } = businessData;

    return (
        <div className="booking-page">
            {/* Header */}
            <header className="booking-header">
                <div className="header-content">
                    <div className="logo" onClick={() => navigate('/homepage')}>
                        <img src={queuelyLogo} alt="Queuely Logo" />
                        <h1>QUEUELY</h1>
                    </div>
                    <div className="header-actions">
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                        <button onClick={() => navigate('/business-register')} className="register-btn">Register your business</button>
                    </div>
                </div>
            </header>

            <div className="booking-container">
                {/* Left Side - Selection Flow */}
                <div className="booking-main">
                    <div className="back-nav">
                        <button className="back-circle" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </button>
                    </div>

                    {/* Service Selection */}
                    <section className="booking-section">
                        <h2 className="section-title">Choose a service</h2>
                        <div className="services-grid">
                            {services.map((service, index) => {
                                const isSelected = selectedServices.find(s => s.service_id === service.service_id);
                                return (
                                    <div
                                        key={service.service_id}
                                        className={`service-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleService(service)}
                                    >
                                        <div className="service-info">
                                            <h3>{service.name}</h3>
                                            <p>{service.duration} mins</p>
                                        </div>
                                        <div className="service-price-tag">
                                            ${parseFloat(service.price).toFixed(0)}
                                        </div>
                                        {isSelected && <div className="check-badge"><Check size={14} /></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Professional Selection */}
                    <section className="booking-section">
                        <h2 className="section-title">Choose a professional</h2>
                        <div className="barbers-list">
                            <div
                                className={`barber-item ${!selectedBarber ? 'selected' : ''}`}
                                onClick={() => setSelectedBarber(null)}
                            >
                                <div className="barber-avatar-placeholder">
                                    <User size={20} />
                                </div>
                                <div className="barber-info">
                                    <h4>Any Professional</h4>
                                    <p>Selected based on availability</p>
                                </div>
                                {!selectedBarber && <div className="check-dot"></div>}
                            </div>
                            {barbers.map(barber => (
                                <div
                                    key={barber.barber_id}
                                    className={`barber-item ${selectedBarber?.barber_id === barber.barber_id ? 'selected' : ''}`}
                                    onClick={() => setSelectedBarber(barber)}
                                >
                                    <div className="barber-avatar">
                                        {barber.name.charAt(0)}
                                    </div>
                                    <div className="barber-info">
                                        <h4>{barber.name}</h4>
                                        <p>{barber.specialization || 'Master Barber'}</p>
                                    </div>
                                    {selectedBarber?.barber_id === barber.barber_id && <div className="check-dot"></div>}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Time Selection */}
                    <section className="booking-section">
                        <div className="section-header">
                            <h2 className="section-title">Choose a time</h2>
                            <div className="calendar-nav">
                                <span>January 2026</span>
                                <button className="today-btn">Today</button>
                            </div>
                        </div>

                        <div className="date-picker">
                            {getDates().map((date, i) => {
                                const { day, num } = formatDateShort(date);
                                const isSelected = selectedDate.toDateString() === date.toDateString();
                                return (
                                    <div
                                        key={i}
                                        className={`date-item ${isSelected ? 'active' : ''}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <span className="date-day">{day}</span>
                                        <div className="date-num">{num}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="time-grid">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                    onClick={() => setSelectedTime(time)}
                                >
                                    <Clock size={14} className="slot-icon" />
                                    {time}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Side - Summary Sidebar */}
                <aside className="booking-summary">
                    <div className="summary-card">
                        <h2 className="summary-title">Your Booking</h2>
                        <p className="shop-subname">{business.shopName || 'Barber Shop'}</p>

                        <div className="summary-items">
                            <div className="summary-professional">
                                <div className="avatar-small">
                                    {selectedBarber ? selectedBarber.name.charAt(0) : 'Any'}
                                </div>
                                <div className="prof-details">
                                    <h4>{selectedBarber ? selectedBarber.name : 'Any Professional'}</h4>
                                    <p>{selectedServices.map(s => s.name).join(', ') || 'No services selected'}</p>
                                </div>
                                <div className="price-bold">${calculateTotal()}</div>
                            </div>

                            {selectedTime && (
                                <div className="summary-time">
                                    <div className="time-info">
                                        <p className="time-val">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedTime}</p>
                                    </div>
                                    <div className="duration-info">{calculateDuration()} mins</div>
                                </div>
                            )}
                        </div>

                        <div className="summary-total">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span className="total-price">${calculateTotal()}</span>
                            </div>
                            <button className="continue-btn" disabled={selectedServices.length === 0 || !selectedTime}>
                                Continue
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default BookingPage;
