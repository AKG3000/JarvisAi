import { sequelize } from './database.js';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';
import { Calendar } from '../models/Calendar.js';

// Force sync all models
// WARNING: This will drop existing tables
async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    } finally {
        process.exit();
    }
}

syncDatabase();
