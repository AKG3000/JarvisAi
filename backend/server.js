// server.js - Main entry point for the Node.js backend

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { sequelize } from './config/database.js';
import { startAgenda } from './config/agenda.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

// Note that async/await is used here
const startServer = async () => {
    await server.start();
    
    app.use('/graphql', express.json(), expressMiddleware(server));
    
    const PORT = process.env.PORT || 4000;
    
    try {
        await sequelize.sync();
        console.log('Connected to MySQL database');
        startAgenda(); // Start job scheduling
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
