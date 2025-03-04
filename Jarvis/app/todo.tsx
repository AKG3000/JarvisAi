import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import TaskCreationModal from "@/components/TaskCreationModal";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "todo" | "inProgress" | "completed";
  isEditing?: boolean;
}

const ToDoScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<
    "todo" | "inProgress" | "completed"
  >("todo");
  const [boardTitle, setBoardTitle] = useState("My Daily Tasks");
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // Add new function to handle task creation
  const handleCreateTask = (title: string,description:string,dueDate:string) => {
    setTodos([
      ...todos,
      {
        id: Date.now().toString(),
        title,
        description,
        status: selectedColumn,
        dueDate,
      },
    ]);
  };

  const updateTodoStatus = (
    id: string,
    newStatus: "todo" | "inProgress" | "completed"
  ) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleEditMode = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // Modify the updateTodoText function
  const updateTodoText = (id: string, newTitle: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newTitle } : todo
      )
    );
  };

  // Update the renderTodoItem component
  const renderTodoItem = ({ item }: { item: TodoItem }) => {
    return (
      <View style={styles.todoItem}>
        <View style={styles.todoContent}>
          {item.isEditing ? (
            <TextInput
              style={[styles.editInput, { color: '#fff' }]}
              value={item.title}
              onChangeText={(newText) => updateTodoText(item.id, newText)}
              onSubmitEditing={() => toggleEditMode(item.id)}
              autoFocus
              multiline
            />
          ) : (
            <TouchableOpacity onPress={() => toggleEditMode(item.id)}>
              <Text style={styles.todoText}>{item.title}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTodo(item.id)}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actionButtons}>
          {item.status !== "todo" && (
            <TouchableOpacity
              style={[styles.statusButton, styles.todoButton]}
              onPress={() => updateTodoStatus(item.id, "todo")}
            >
              <Text style={styles.statusButtonText}>Todo</Text>
            </TouchableOpacity>
          )}
          {item.status !== "inProgress" && (
            <TouchableOpacity
              style={[styles.statusButton, styles.inProgressButton]}
              onPress={() => updateTodoStatus(item.id, "inProgress")}
            >
              <Text style={styles.statusButtonText}>In Progress</Text>
            </TouchableOpacity>
          )}
          {item.status !== "completed" && (
            <TouchableOpacity
              style={[styles.statusButton, styles.completedButton]}
              onPress={() => updateTodoStatus(item.id, "completed")}
            >
              <Text style={styles.statusButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            {isTitleEditing ? (
              <TextInput
                style={styles.titleInput}
                value={boardTitle}
                onChangeText={setBoardTitle}
                onBlur={() => setIsTitleEditing(false)}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => setIsTitleEditing(true)}>
                <Text style={styles.title}>{boardTitle}</Text>
              </TouchableOpacity>
            )}
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons name="share-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cover and Description Section */}
          <View style={styles.coverSection}>
            <TouchableOpacity style={styles.addCoverButton}>
              <Ionicons name="image-outline" size={20} color="#666" />
              <Text style={styles.addCoverText}>Add cover</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addDescriptionButton}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
              />
              <Text style={styles.addDescriptionText}>Add description</Text>
            </TouchableOpacity>
          </View>

          {/* Search and Filter Section */}
          <View style={styles.filterSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#666"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="people" size={20} color="#666" />
              <Text style={styles.filterText}>Assignee</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.filterText}>Due</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Existing ScrollView with columns */}
          <ScrollView horizontal style={styles.boardContainer}>
            <View style={styles.column}>
              <View style={styles.columnHeader}>
                <Text style={styles.columnTitle}>Todo</Text>
                <View style={styles.columnHeaderRight}>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.plusIcon}
                    onPress={() => {
                      setSelectedColumn("todo");
                      setIsModalVisible(true);
                    }}
                  >
                    <Ionicons name="add-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView style={styles.columnContent}>
                {todos
                  .filter((todo) => todo.status === "todo")
                  .map((todo) => (
                    <View key={todo.id}>{renderTodoItem({ item: todo })}</View>
                  ))}
              </ScrollView>
            </View>

            <View style={styles.column}>
              <View style={styles.columnHeader}>
                <Text style={styles.columnTitle}>In Progress</Text>
                <View style={styles.columnHeaderRight}>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView style={styles.columnContent}>
                {todos
                  .filter((todo) => todo.status === "inProgress")
                  .map((todo) => (
                    <View key={todo.id}>{renderTodoItem({ item: todo })}</View>
                  ))}
              </ScrollView>
            </View>

            <View style={styles.column}>
              <View style={styles.columnHeader}>
                <Text style={styles.columnTitle}>Completed</Text>
                <View style={styles.columnHeaderRight}>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView style={styles.columnContent}>
                {todos
                  .filter((todo) => todo.status === "completed")
                  .map((todo) => (
                    <View key={todo.id}>{renderTodoItem({ item: todo })}</View>
                  ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        <TaskCreationModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onCreateTask={handleCreateTask}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  columnHeader: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerRight: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  columnHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  shareButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
    padding: 0,
  },
  coverSection: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  addCoverButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  addCoverText: {
    color: "#666",
    marginLeft: 8,
  },
  addDescriptionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addDescriptionText: {
    color: "#666",
    marginLeft: 8,
  },
  filterSection: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
    padding: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
  },
  filterText: {
    color: "#666",
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: "#888888",
  },
  plusIcon: {
    marginLeft: 10,
  },
  todoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 24,
    fontWeight: "bold",
  },
  boardContainer: {
    flex: 1,
  },
  column: {
    width: 300,
    marginRight: 15,
    backgroundColor: "#2D2D2D",
    borderRadius: 10,
    padding: 10,
  },
  todoItem: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  todoText: {
    color: "#fff",
    fontSize: 16,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    flex: 1,
    textAlign: "center",
  },
  columnContent: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 5,
  },
  statusButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  todoButton: {
    backgroundColor: "#007AFF",
  },
  inProgressButton: {
    backgroundColor: "#FF9500",
  },
  completedButton: {
    backgroundColor: "#34C759",
  },
  statusButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
  },
});

export default ToDoScreen;
