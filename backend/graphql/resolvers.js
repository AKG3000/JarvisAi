import { User } from '../models/User.js';
import { Task } from '../models/Task.js';
import { Calendar } from '../models/Calendar.js';
import { auth, generateToken } from '../middleware/auth.js';

export const resolvers = {
    Query: {
        me: async (_, __, { req }) => {
            const authData = await auth(req);
            return await User.findByPk(authData.userId);
        },
        getUsers: async () => await User.findAll(),
        getTasks: async () => await Task.findAll(),
        getCalendars: async () => await Calendar.findAll(),
        getUserTasks: async (_, __, { req }) => {
            const authData = await auth(req);
            return await Task.findAll({ where: { userId: authData.userId }});
        },
        getUserCalendars: async (_, __, { req }) => {
            const authData = await auth(req);
            return await Calendar.findAll({ where: { userId: authData.userId }});
        }
    },
    Mutation: {
        register: async (_, { name, email, password }) => {
            const existingUser = await User.findOne({ where: { email }});
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const user = await User.create({
                name,
                email,
                password
            });

            const token = generateToken(user);
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ where: { email }});
            if (!user) {
                throw new Error('No user found with this email');
            }

            const validPassword = await user.comparePassword(password);
            if (!validPassword) {
                throw new Error('Invalid password');
            }

            const token = generateToken(user);
            return { token, user };
        },
        createTask: async (_, { title, description, dueDate }, { req }) => {
            const authData = await auth(req);
            return await Task.create({
                title,
                description,
                dueDate,
                userId: authData.userId
            });
        },
        createCalendarEvent: async (_, { eventName, eventDate }, { req }) => {
            const authData = await auth(req);
            return await Calendar.create({
                eventName,
                eventDate,
                userId: authData.userId
            });
        },
        updateTask: async (_, { id, ...updates }, { req }) => {
            const authData = await auth(req);
            const task = await Task.findOne({ 
                where: { 
                    id,
                    userId: authData.userId 
                }
            });
            
            if (!task) {
                throw new Error('Task not found or unauthorized');
            }
            
            await task.update(updates);
            return task;
        },
        deleteTask: async (_, { id }, { req }) => {
            const authData = await auth(req);
            const deleted = await Task.destroy({ 
                where: { 
                    id,
                    userId: authData.userId 
                }
            });
            return deleted > 0;
        },
        updateCalendarEvent: async (_, { id, ...updates }, { req }) => {
            const authData = await auth(req);
            const event = await Calendar.findOne({ 
                where: { 
                    id,
                    userId: authData.userId 
                }
            });
            
            if (!event) {
                throw new Error('Calendar event not found or unauthorized');
            }
            
            await event.update(updates);
            return event;
        },
        deleteCalendarEvent: async (_, { id }, { req }) => {
            const authData = await auth(req);
            const deleted = await Calendar.destroy({ 
                where: { 
                    id,
                    userId: authData.userId 
                }
            });
            return deleted > 0;
        }
    }
};
