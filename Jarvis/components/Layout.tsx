import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface LayoutProps {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void;
}

const Layout = ({ children, userName, onLogout }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-300))[0];

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsMenuOpen(false);
      });
    }
  };

  const navigateTo = (route: string) => {
    toggleMenu();
    router.push(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Jarvis AI</Text>
      </View>

      <Modal
        visible={isMenuOpen}
        transparent={true}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        >
          <Animated.View 
            style={[
              styles.menuContainer,
              {
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            <View style={styles.menu}>
              <Text style={styles.userName}>{userName}</Text>
              
              {/* Navigation Section */}
              <View style={styles.navSection}>
                <TouchableOpacity 
                  style={styles.navItem} 
                  onPress={() => navigateTo('/home')}
                >
                  <Ionicons name="home-outline" size={22} color="#2563EB" style={{ marginRight: 12 }} />
                  <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.navItem} 
                  onPress={() => navigateTo('/todo')}
                >
                  <Ionicons name="list-outline" size={22} color="#2563EB" style={{ marginRight: 12 }} />
                  <Text style={styles.navText}>Todo List</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={() => { 
                  toggleMenu();
                  onLogout();
                }}
              >
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    height: 70,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  menuIcon: {
    fontSize: 22,
    color: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  menu: {
    padding: 25,
    marginTop: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  navSection: {
    marginBottom: 40,
  },
  navItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 15,
  },
});

export default Layout;