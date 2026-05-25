import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GameProvider } from './context/GameContext';
import BottomBar from './components/BottomBar';
import DevBar from './components/DevBar';
import SettingsBar from './components/SettingsBar';

// Helper to reset Quiz state when category changes by using a unique key
const QuizWrapper = () => {
  const { category } = useParams<{ category: string }>();
  return <Quiz key={category} />;
};

// The main component that renders the app, quite self-explanatory
function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <DevBar />
        <BrowserRouter>
          <SettingsBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz/:category" element={<QuizWrapper />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
          </Routes>
          <BottomBar />
        </BrowserRouter>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
