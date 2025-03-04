import { Stack } from "expo-router";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Platform } from "react-native";

// Initialize Apollo Client
// Get the correct localhost URL based on platform
const localhostUrl = Platform.select({
  ios: 'http://localhost:4000/graphql',
  android: 'http://10.0.2.2:4000/graphql',
  default: 'http://localhost:4000/graphql',
});

const client = new ApolloClient({
  uri: localhostUrl,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
  connectToDevTools: true,
});


export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="todo" 
          options={{ 
            headerShown: true,
            title: 'ToDo List'
          }} 
        />
      </Stack>
    </ApolloProvider>
  );
}
