import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';

export const Calendar = sequelize.define('Calendar', {
    eventName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eventDate: DataTypes.DATE,
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

Calendar.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Calendar, { foreignKey: 'userId' });
