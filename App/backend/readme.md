# Apollo server backend

The backend for the flag game app that serves the data. As this is part of a showcase project, the repository contains also files that normally wouldn't be included, ie. .prettier\* files etc.

## Installation

```shell
rm package-lock.json
npm install
npm run dev
```

## Architecture plan of the backend (to be implemented)

App/backend/
├── src/
│   ├── database/
│   │   ├── connect.ts          # Sequelize initialization for db connection
│   │   └── migrations.ts       # Umzug configuration for db migrations
│   ├── services/
│   │   └── paymentProvider.ts  # Mock payment provider for testing
│   ├── plugins/
│   │   └── loggingPlugin.ts    # Apollo server plugin for logging
│   ├── models/                 # Sequelize Model definitions
│   │   ├── User.ts
│   │   ├── Country.ts
│   │   └── Score.ts
│   ├── schema/                 # GraphQL Layer
│   │   ├── typeDefs.ts         # Type definitions for GraphQL
│   │   └── resolvers.ts        # Resolvers for GraphQL
│   ├── middleware/             # Auth & Logging middleware for Express
│   │   ├── auth.ts             # Authentication middleware
│   │   └── logger.ts           # Logging middleware
│   └── index.ts                # Entry point (Express + Apollo)
├── .env                        # Local environment variables
└── package.json

### Tech stack

* Node.js               #Runtime environment
* Axios                 #HTTP client for communicating with the mock payment provider
* Express               #Web framework
* Apollo Server         #GraphQL framework
* Sequelize             #ORM for database
* Umzug                 #Database migration tool
* GraphQL               #API query language
* Jsonwebtoken          #JSON web token utility for authentication and authorization
* Pg                    #PostgreSQL driver
* Nodemon               #Development server hot-reloader
* Bcrypt                #Password hashing utility
* Pino                  #Logging utility
* Dotenv                #Environment variable management utility
* Jest                  #Unit testing framework
* Supertest             #API testing utility
* Prettier              #Code formatter
* ESLint                #Linting utility
* Typescript            #TypeScript compiler

## TBD

The current iteration serves the countries app plan, but with some restructuring the data could be practically anything. The object would have name, category and an image url as mandatory fields, but then it could have optional fields like facts that could contain any further information about the object. This would allow for a lot of flexibility and scalability.