import { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, CheckCircle2, XCircle, Clock, Info } from 'lucide-react';
import { apiCall } from '../utils/api';

const NotificationPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await apiCall('GET', '/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setNotifications(response.data.data);
                const unread = response.data.data.filter(n => !n.is_read).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = async (notification_id) => {
        try {
            const token = localStorage.getItem('token');
            await apiCall('PATCH', `/notifications/${notification_id}/read`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await apiCall('PATCH', '/notifications/read-all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'BOOKING_ACCEPTED': return <CheckCircle2 size={16} color="#22c55e" />;
            case 'BOOKING_DECLINED': return <XCircle size={16} color="#ef4444" />;
            case 'BOOKING_PENDING': return <Clock size={16} color="#f97316" />;
            default: return <Info size={16} color="#3b82f6" />;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / 60000);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-panel-container" style={{ position: 'relative' }} ref={panelRef}>
            <button
                className="notification-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                <Bell size={22} />
                {unreadCount > 0 && <span className="unread-badge"></span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="btn-mark-all" onClick={markAllAsRead}>Mark all as read</button>
                        )}
                    </div>

                    <div className="notifications-list">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.notification_id}
                                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                                    onClick={() => !notification.is_read && markAsRead(notification.notification_id)}
                                >
                                    <div className="notification-type-icon">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <h4>{notification.title}</h4>
                                        <p>{notification.message}</p>
                                        <span className="notification-time">{formatTime(notification.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-notifications">
                                <div className="no-notifications-icon">
                                    <BellOff size={40} />
                                </div>
                                <p>No notifications yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
