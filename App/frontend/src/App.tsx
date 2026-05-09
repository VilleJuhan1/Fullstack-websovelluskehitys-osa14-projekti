import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameProvider } from './context/GameContext';

// The main component that renders the app, quite self-explanatory
function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:category" element={<Quiz />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
