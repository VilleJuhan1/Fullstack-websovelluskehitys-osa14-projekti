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
    name: String!
    translations: TranslationsType
    category: String!
    image: String!
  }
  
  type TranslationsType {
    common: String!
    official: String
    fin: String
    swe: String
  }
`;
