import { DataTypes } from 'sequelize';
import { sequelize } from '../database/index.js';

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'businesses',
            key: 'business_id',
        },
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    customer_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    barber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED'),
        defaultValue: 'PENDING',
        allowNull: false,
    },
}, {
    tableName: 'bookings',
    timestamps: true,
});

export default Booking;