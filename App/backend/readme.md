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
│   │   ├── connect.ts      # Sequelize initialization for db connection
│   │   └── migrations.ts   # Umzug configuration for db migrations
│   ├── models/             # Sequelize Model definitions
│   │   ├── User.ts
│   │   ├── Country.ts
│   │   └── Score.ts
│   ├── schema/             # GraphQL Layer
│   │   ├── typeDefs.ts
│   │   └── resolvers.ts
│   ├── middleware/         # Auth & Logging
│   │   ├── auth.ts
│   │   └── logger.ts
│   └── index.ts            # Entry point (Express + Apollo)
├── .env                    # Local environment variables
└── package.json

### Tech stack

* Node.js
* Express
* Apollo Server
* Sequelize
* Umzug
* GraphQL
* Jsonwebtoken
* Pg
* Nodemon
* Bcrypt
* Pino
* Dotenv

## TBD

The current iteration serves the countries app plan, but with some restructuring the data could be practically anything. The object would have name, category and an image url as mandatory fields, but then it could have optional fields like facts that could contain any further information about the object. This would allow for a lot of flexibility and scalability.