import Login from "@/components/Login";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const handleAuthSuccess = () => {
    router.push('/todo');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        userName={userName}
        setUserName={setUserName}
        onAuthSuccess={handleAuthSuccess}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
