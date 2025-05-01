import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async () => {
    if (!input.trim()) {
      setError('Введите ингредиенты (на английском, например "chicken, rice")');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = '076f7bfb2b964919b5075e4bebd5b9b0';
      const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(input)}&apiKey=${apiKey}`;

      console.log('Отправляю запрос:', url); // Для отладки

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Неверный API-ключ. Получите новый на spoonacular.com');
        }
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
      console.error('Детали ошибки:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🍳 Search for recipes</h1>
      
      <div className="search-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="chicken, rice (только английский)"
        />
        <button onClick={searchRecipes} disabled={loading}>
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="recipes">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <img src={recipe.image} alt={recipe.title} />
              <p>Использовано: {recipe.usedIngredientCount} ингредиентов</p>
            </div>
          ))
        ) : (
          !loading && <p>Попробуйте: "eggs, milk" или "chicken, rice"</p>
        )}
      </div>
    </div>
  );
}

export default App;