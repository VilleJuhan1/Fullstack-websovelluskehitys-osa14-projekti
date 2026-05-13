import { countryResolvers } from './resolvers/countryResolvers';
import { pokemonResolvers } from './resolvers/pokemonResolvers';
import { userResolvers } from './resolvers/userResolvers';
import { authResolvers } from './resolvers/authResolvers';

export const resolvers = {
  Query: {
    ...countryResolvers.Query,
    ...pokemonResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
};
