import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { setContext } from '@apollo/client/link/context';

const graphqlUri = import.meta.env.VITE_API_URL || '/graphql';

const httpLink = new HttpLink({ uri: graphqlUri });

// Add token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('quiz-user-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Global Error Logging Middleware for Apollo v4
const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  } else {
    console.error(`[Network error]: ${error}`);
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
