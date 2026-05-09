import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Separate ApolloClient component for all components
export const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/' }),
  cache: new InMemoryCache(),
});
