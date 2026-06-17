# Cloud Sandbox Frontpage

A central hub and landing page for the cloud sandbox project. It provides quick access to various deployed services, such as the quiz game, Grafana dashboards, and Argo CD.

## Tech Stack
- **React** (UI Library)
- **TypeScript** (Static Typing)
- **Vite** (Build Tool & Dev Server)
- **Vanilla CSS** (Styling using modern custom properties and glassmorphism)

## Project Structure
- `src/App.tsx`: Main entry point and layout container.
- `src/components/`: Reusable UI components (`ServicesBar` for navigation, `BottomBar` for social links).
- `src/index.css`: Global styling and design system variables.

## Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) installed.

### Setup & Run
1. Install dependencies:
    ```bash
    npm install
    ```
2. Start the development server:
    ```bash
    npm run dev
    # or 'npm run dev -- --host' for network access
    ```
3. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Production
1. To create a production-ready build:
    ```bash
    npm run build
    ```
2. And then run:
    ```bash
    npm start
    ```
### Containerization
