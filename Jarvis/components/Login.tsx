import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [login, {loading: loginLoading}] = useMutation(LOGIN_MUTATION);
  const [register, {loading: registerLoading}] = useMutation(REGISTER_MUTATION);

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
        <Text style={styles.title}>Welcome to Jarvis</Text>
        <Text style={styles.subtitle}>
          Login or Sign up to access your account
        </Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, !isRegistering && styles.activeTab]}
            onPress={() => setIsRegistering(false)}
          >
            <Text style={[styles.tabText, !isRegistering && styles.activeTabText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, isRegistering && styles.activeTab]}
            onPress={() => setIsRegistering(true)}
          >
            <Text style={[styles.tabText, isRegistering && styles.activeTabText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Image 
            source={{ uri: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image 
            source={{ uri: 'https://www.apple.com/ac/globalnav/7/en_US/images/be15095f-5a20-57d0-ad14-cf4c638e223a/globalnav_apple_image__b5er5ngrzxqq_large.svg' }}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Login with Apple</Text>
        </TouchableOpacity>

        <Text style={styles.dividerText}>or continue with email</Text>

        {isRegistering && (
          <CustomInput
            label="Username"
            value={userName}
            onChangeText={setUserName}
            error={errors.userName}
            placeholder="Enter your username"
          />
        )}

        <CustomInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          placeholder="Enter your email"
        />

        <CustomInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          placeholder="Enter your password"
        />

        {!isRegistering && (
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        <CustomButton
          title={isRegistering ? "Sign Up" : "Login"}
          onPress={isRegistering ? handleRegister : handleLogin}
          style={styles.mainButton}
        />

        <Text style={styles.termsText}>
          By signing in with an account, you agree to SO's{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    width: '100%',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#000',
  },
  dividerText: {
    color: '#666',
    marginVertical: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#666',
  },
  mainButton: {
    width: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 12,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
});

export default Login;
