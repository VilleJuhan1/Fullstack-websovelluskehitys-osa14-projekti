import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { setContext } from '@apollo/client/link/context';

const graphqlUri = import.meta.env.VITE_API_URL || '/graphql';

const httpLink = new HttpLink({ uri: graphqlUri });

// Add token to headers and enforce expiration
const authLink = setContext((_, { headers }) => {
  let token = localStorage.getItem('quiz-user-token');
  const expiresAt = localStorage.getItem('quiz-user-token-expires');

  if (token && expiresAt && Date.now() > Number(expiresAt)) {
    localStorage.removeItem('quiz-user-token');
    localStorage.removeItem('quiz-user-token-expires');
    window.dispatchEvent(new Event('auth-change'));
    token = null;
  }

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
