import { countryResolvers } from './resolvers/countryResolvers';
import { pokemonResolvers } from './resolvers/pokemonResolvers';
import { userResolvers } from './resolvers/userResolvers';
import { authResolvers } from './resolvers/authResolvers';
import { scoreResolvers } from './resolvers/scoreResolvers';

export const resolvers = {
  Query: {
    ...countryResolvers.Query,
    ...pokemonResolvers.Query,
    ...userResolvers.Query,
    ...scoreResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
};
