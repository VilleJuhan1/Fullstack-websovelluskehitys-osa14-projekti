// The type definitions for the GraphQL schema <- can be refactored into separate files
export const typeDefs = `#graphql
  type Country {
    name: String!
    translation: String!
    region: String!
    flag: String!
    population: Int
    capital: String
  }

  type User {
    id: Int!
    username: String!
    email: String
    hashedPassword: String!
    isAdmin: Boolean!
    isPremiumUser: Boolean!
    isActive: Boolean!
    scores: [Score!]!
  }

  type Score {
    id: Int!
    category: String!
    totalRounds: Int!
    totalRight: Int!
    totalWrong: Int!
    highestStreak: Int!
  }

  type Query {
    allCountries: [CountryType!]!
    allPokemon: [PokemonType!]!
    country(name: String!): CountryType
    pokemon(name: String!): PokemonType
    allUsers: [User!]!
    user(username: String!): User
    topScores(category: String, limit: Int): [Score!]!
  }

  type Mutation {
    login(username: String!, password: String!): Token
  }

  type Token {
    value: String!
  }

  type PokemonType {
    id: Int!
    name: String!
    translations: TranslationsType
    categories: [String!]
    imageUrl: String!
  }

  type CountryType {
    id: Int!
    name: String!
    translations: TranslationsType
    categories: [String!]
    imageUrl: String!
  }
  
  type TranslationsType {
    fin: String
    swe: String
  }
`;
