import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const user_id = req.user.userId;
        const notifications = await Notification.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const user_id = req.user.userId;

        const notification = await Notification.findOne({
            where: { notification_id, user_id },
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found',
            });
        }

        notification.is_read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const user_id = req.user.userId;

        await Notification.update(
            { is_read: true },
            { where: { user_id, is_read: false } }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
