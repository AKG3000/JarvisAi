import { gql } from "@apollo/client";

export const CREATE_TODO = gql`
  mutation CreateTask($title: String!, $description: String, $dueDate: String) {
    createTask(title: $title, description: $description, dueDate: $dueDate) {
      title
      userId
      description
      dueDate
    }
  }
`;

export const UPDATE_TODO_STATUS = gql`
  mutation CreateTask(
    $title: String
    $description: String
    $dueDate: String
    $updateTaskId: ID!
  ) {
    updateTask(
      title: $title
      description: $description
      dueDate: $dueDate
      id: $updateTaskId
    ) {
      title
      userId
      description
      dueDate
      id
    }
  }
`;

export const DELETE_TODO = gql`
  mutation CreateTask($deleteTaskId: ID!) {
    deleteTask(id: $deleteTaskId)
  }
`;
