import Layout from "./Layout";
import { View, Text, StyleSheet } from 'react-native';

interface HomeProps {
  userName: string;
  onLogout: () => void;
}

const Home = ({ userName, onLogout }: HomeProps) => {
  return (
    <Layout userName={userName} onLogout={onLogout}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to Jarvis AI</Text>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 24,
    color: "#gggggg",
    fontWeight: "bold",
  },
});

export default Home;