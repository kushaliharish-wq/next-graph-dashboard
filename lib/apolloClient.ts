// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: '/api/graphql', // Yoga serves it here
  cache: new InMemoryCache(),
});

export default client;
