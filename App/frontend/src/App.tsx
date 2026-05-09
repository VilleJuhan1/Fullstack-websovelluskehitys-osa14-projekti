import './App.css';

function App() {
  return (
    <div className="container flex-center" style={{ minHeight: '100vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '800px', textAlign: 'center' }}>
        <h1 className="text-gradient">Who's that Pokémon?</h1>
        <p>A demonstration of our new premium design system.</p>
        
        <div className="grid-2x2" style={{ margin: '2rem 0' }}>
          <div className="quiz-option">Pikachu</div>
          <div className="quiz-option">Bulbasaur</div>
          <div className="quiz-option">Charmander</div>
          <div className="quiz-option">Squirtle</div>
        </div>

        <button className="btn btn-primary">Start Game</button>
      </div>
    </div>
  );
}

export default App;
