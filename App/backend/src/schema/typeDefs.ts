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
`;
