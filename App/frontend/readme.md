# Quiz game frontend

A simple showcase of a stateful web app.

## Features

- Game: Multiple choice quiz with different categories and subcategories.
- User management: Login, logout, signup and authenticated user specific queries and mutations are implemented, ie. streak score. Persistent user data via backend and postgresql DB.
- Dynamic styling: Hovering over elements triggers a background blur effect, score streak adds a golden effect to the score text, wrong answer has a red outline and text color while correct answer is shown as green.

## Planned features:

- Premium user functionalities: Access to more categories
- Mock payment service: Elevate standard users to premium via mock payment provider
- Language support: UI translations to Finnish and Swedish

## Tech stack

| Category | Technologies |
| --- | --- |
| Build tool | Vite |
| Framework | React |
| Language | TypeScript |
| Router | React Router |
| State management | React hooks, Context API |
| GraphQL client | Apollo Client |
| Testing | Vitest, @testing-library, Playwright |
| Styling | CSS, Glassmorphism |

## Installation

```shell
npm ci
# or
npm install
```

## Commands

| Command | Description |
| --- | --- |
| npm run dev | Start development server |
| npm run build | Build for production |
| npm run preview | Preview production build |
| npm run lint | Lint the code using eslint |
| npm run format | Format the code using prettier |
| npm run test | Run unit tests using vitest and @testing-library |
| npm run test:coverage | Run unit tests with coverage using vitest and @testing-library |
| npm run test:e2e | Run end-to-end tests using playwright |

## Environment variables

```shell
VITE_LINKEDIN_URL=https://linkedin.com # Used in the socials bar
VITE_GITHUB_URL=https://github.com # Used in the socials bar
VITE_APP_VERSION=v0.0.1-local-dev # Used in the DevBar to indicate the app version, automatically updated during build process
VITE_API_URL=/graphql # Used for GraphQL API endpoint via nginx reverse proxy
VITE_SHOW_DEV_BAR=true # Used to show the dev bar
```