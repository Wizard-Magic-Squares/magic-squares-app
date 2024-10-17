import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [squares, setSquares] = useState([]);
  const size = 30;

  useEffect(() => {
    fetch("https://localhost:7044/api/square/squares")
      .then(response => response.json())
      .then(data => {
        setSquares(data);
      })
      .catch(error => {
        console.error("Error loading squares:", error);
      });
  }, []);

  const addSquare = () => {
    fetch("https://localhost:7044/api/square/randomcolor")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const newSquare = {
          color: data.color,
          position: squares.length
        };
        const updatedSquares = [...squares, newSquare];
        setSquares(updatedSquares);
        saveSquares(updatedSquares);
      })
      .catch(error => {
        console.error("There was an error fetching the color!", error);
      });
  };

  const saveSquares = (squaresToSave) => {
    fetch("https://localhost:7044/api/square/squares", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(squaresToSave),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error saving squares');
      }
    })
    .catch(error => {
      console.error("There was an error saving the squares!", error);
    });
  };

  const clearSquares = () => {
    setSquares([]);
    fetch("https://localhost:7044/api/square/squares/clear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([]),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error clearing squares');
      }
    })
    .catch(error => {
      console.error("There was an error clearing the squares!", error);
    });
};

  const numColumns = Math.ceil(Math.sqrt(squares.length));

  return (
    <div className="App">
      <div
        className="square-container"
        style={{ gridTemplateColumns: `repeat(${numColumns}, ${size}px)` }}
      >
        {squares.map((square, index) => (
          <div
            key={index}
            className="square"
            style={{ backgroundColor: square.color, width: `${size}px`, height: `${size}px` }} // Set size dynamically
          ></div>
        ))}
      </div>
      <div className="buttons">
        <button className="add-btn" onClick={addSquare}>Lägg till en ruta</button>
        <button className="clear-btn" onClick={clearSquares}>Rensa alla rutor</button>
      </div>
    </div>
  );
}

export default App;
