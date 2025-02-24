import { gql } from 'graphql-tag';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
    }

    type Task {
        id: ID!
        title: String!
        description: String
        dueDate: String
        userId: ID!
    }

    type Calendar {
        id: ID!
        eventName: String!
        eventDate: String
        userId: ID!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        getUsers: [User]
        getTasks: [Task]
        getCalendars: [Calendar]
        getUserTasks: [Task]
        getUserCalendars: [Calendar]
    }

    type Mutation {
        register(name: String!, email: String!, password: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
        createTask(title: String!, description: String, dueDate: String): Task
        createCalendarEvent(eventName: String!, eventDate: String!): Calendar
        updateTask(id: ID!, title: String, description: String, dueDate: String): Task
        deleteTask(id: ID!): Boolean
        updateCalendarEvent(id: ID!, eventName: String, eventDate: String): Calendar
        deleteCalendarEvent(id: ID!): Boolean
    }
`;
