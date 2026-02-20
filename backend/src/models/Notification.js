import { DataTypes } from 'sequelize';
import { sequelize } from '../database/index.js';

const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('BOOKING_PENDING', 'BOOKING_ACCEPTED', 'BOOKING_DECLINED', 'BOOKING_COMPLETED', 'NEW_REVIEW', 'GENERAL'),
        defaultValue: 'GENERAL',
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'notifications',
    timestamps: true,
});

export default Notification;
