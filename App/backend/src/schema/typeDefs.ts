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
  }

  type Query {
    allCountries: [CountryType!]!
    allPokemon: [PokemonType!]!
    country(name: String!): CountryType
    pokemon(name: String!): PokemonType
    allUsers: [User!]!
    user(username: String!): User
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
