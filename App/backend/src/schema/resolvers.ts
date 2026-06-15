import { countryResolvers } from './resolvers/countryResolvers';
import { pokemonResolvers } from './resolvers/pokemonResolvers';
import { dotaHeroResolvers } from './resolvers/dotaHeroResolvers';
import { userResolvers } from './resolvers/userResolvers';
import { authResolvers } from './resolvers/authResolvers';
import { scoreResolvers } from './resolvers/scoreResolvers';

// Combine all resolvers
export const resolvers = {
  Query: {
    ...countryResolvers.Query,
    ...pokemonResolvers.Query,
    ...dotaHeroResolvers.Query,
    ...userResolvers.Query,
    ...scoreResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...scoreResolvers.Mutation,
    ...userResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
};
