import { DataTypes } from 'sequelize';
import { sequelize } from '../database/index.js';

const Service = sequelize.define('Service', {
    service_id: {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'services',
    timestamps: true,
});

export default Service;