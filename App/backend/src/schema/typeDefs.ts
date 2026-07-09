// The type definitions for the GraphQL schemas
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
    highestStreak: Int!
  }

  type Query {
    allCountries: [CountryType!]!
    allPokemon: [PokemonType!]!
    allDotaHeroes: [DotaHeroType!]!
    allKana: [KanaType!]!
    country(name: String!): CountryType
    pokemon(name: String!): PokemonType
    dotaHero(name: String!): DotaHeroType
    kana(name: String!): KanaType
    allUsers: [User!]!
    user(username: String!): User
    topScores(category: String, limit: Int): [Score!]!
    me: User
  }

  type Mutation {
    login(username: String!, password: String!): Token
    createUser(username: String!, password: String!, email: String!): User
    updateStreakScore(category: String!, streak: Int!): Score!
    upgradeToPremium(paymentMethodId: String!): User!
  }

  type Token {
    value: String!
    expiresAt: Float!
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

  type DotaHeroType {
    id: Int!
    name: String!
    translations: TranslationsType
    categories: [String!]
    imageUrl: String!
  }

  type KanaType {
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
