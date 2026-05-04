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
    allCountries: [Country!]!
    country(name: String!): Country
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
