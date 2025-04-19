import { StyleSheet, View, Text } from "react-native";
import CustomInput from "./Input";
import CustomButton from "./Button";
import { useState } from "react";
import React from "react";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";

interface LoginProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  userName: string;
  setUserName: (userName: string) => void;
  onAuthSuccess: (userName: string) => void;  // Modified to pass userName
}

// Define GraphQL mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    user {
      email,
      id
    }
    token
  }
}
`;

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
const registerSchema = yup.object().shape({
  userName: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  userName,
  setUserName,
  onAuthSuccess
}: LoginProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [errors,setErrors] = useState<{[key: string]: string}>({});
  const [login,{loading:loginLoading}]=useMutation(LOGIN_MUTATION); 
  const [register,{loading:registerLoading}]=useMutation(REGISTER_MUTATION);

  const handleLogin = async () => {
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      console.log("Login validation passed");
      const { data } = await login({
        variables: { email, password },
      });
      if (data.login.token) {
        onAuthSuccess(data.login.user.name); // Pass the user name
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: {[key: string]: string} = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }else {
        console.log("Login error:", error);
      }
    }
  };

  const handleRegister = async () => {
    try {
      await registerSchema.validate({ userName, email, password }, { abortEarly: false });
      console.log("Registration validation passed");
      const { data } = await register({
        variables: { name, email, password },
      });
      if (data.register.token) {
        onAuthSuccess(data.login.user.name);
      }
      // Proceed with registration logic
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: {[key: string]: string} = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
      else {
        console.log("Registration error:", error);
      }
    }
  };
  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>Welcome to Jarvis</Text>
        <Text style={styles.subtitle}>
          {isRegistering ? "Register" : "Kindly Login"}
        </Text>
        {isRegistering && (
          <CustomInput
            label="UserName"
            type="email"
            value={userName}
            onChangeText={setUserName}
            width={"80%"}
            error={errors.userName}
          />
        )}
        <CustomInput
          label="Email"
          type="email"
          value={email}
          onChangeText={setEmail}
          width={"80%"}
          error={errors.email}
        />
        <CustomInput
          label="Password"
          type="password"
          value={password}
          onChangeText={setPassword}
          width={"80%"}
          error={errors.password}
        />
        {!isRegistering ? (
          <>
            <CustomButton
              title="Login"
              onPress={handleLogin}
            />
            <Text style={styles.mintitle}>Not Logged In?</Text>
            <CustomButton
              title="Register"
              onPress={() => {
                setIsRegistering(true);
                setErrors({});
            }}
            />
          </>
        ) : (
          <>
            <CustomButton
              title="Register"
              onPress={handleRegister}
            />
            <Text style={styles.mintitle}>Already have an account?</Text>
            <CustomButton
              title="Back to Login"
              onPress={() => {
                setIsRegistering(false);
                setErrors({});
            }}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    display: "flex",
    height: "100%",
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fb5b5a",
    marginBottom: 10,
  },
  mintitle: {
    fontWeight: "bold",
    fontSize: 10,
    color: "#fb5b5a",
  },
});

export default Login;
