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
    allCountries: [CountryType!]!
    allPokemon: [PokemonType!]!
    country(name: String!): CountryType
    pokemon(name: String!): PokemonType
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
