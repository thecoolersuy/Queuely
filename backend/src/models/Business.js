// backend/src/models/Business.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/index.js';

const Business = sequelize.define('Business', {
    business_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shopName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    localLocation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    businessFocus: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    resetOtp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetOtpExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    resetOtpVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'businesses',
    timestamps: true,
});

export default Business;