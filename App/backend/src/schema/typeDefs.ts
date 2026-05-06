export const typeDefs = `#graphql
  type Country {
    name: String!
    translation: String!
    region: String!
    flag: String!
    population: Int
    capital: String
  }

  type Query {
    allCountries: [ObjectType!]!
    allPokemon: [ObjectType!]!
    country(name: String!): ObjectType
    pokemon(name: String!): ObjectType
  }

  type ObjectType {
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
