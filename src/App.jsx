import React, { useState, useEffect } from 'react';
import ChessBoard from './components/ChessBoard';
import MoveList from './components/MoveList';
import Timers from './components/Timers';
import CapturedPieces from './components/CapturedPieces';
import { Chess } from 'chess.js';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'

const App = () => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [moves, setMoves] = useState([]);
  const [activePlayer, setActivePlayer] = useState('w');
  const [boardSize, setBoardSize] = useState(400);
  const [capturedPieces, setCapturedPieces] = useState({ w: [], b: [] });
  const [isPaused, setIsPaused] = useState(false);
  const [resetTimers, setResetTimers] = useState(false);

  const handleMove = (move) => {
    setMoves([...moves, { player: activePlayer, san: move.san }]);
    setActivePlayer(activePlayer === 'w' ? 'b' : 'w');
    setPosition(game.fen());
    setResetTimers(true);
  };

  const handleCapture = (move) => {
    setCapturedPieces((prev) => ({
      ...prev,
      [move.color === 'w' ? 'b' : 'w']: [
        ...prev[move.color === 'w' ? 'b' : 'w'],
        move.captured,
      ],
    }));
  };

  const handleUndo = () => {
    const move = game.undo();
    if (move) {
      setPosition(game.fen());
      setMoves(moves.slice(0, -1));
      setActivePlayer(activePlayer === 'w' ? 'b' : 'w');
      setResetTimers(true);
      if (move.captured) {
        setCapturedPieces((prev) => {
          const updatedCaptured = [...prev[move.color === 'w' ? 'b' : 'w']];
          updatedCaptured.pop();
          return {
            ...prev,
            [move.color === 'w' ? 'b' : 'w']: updatedCaptured,
          };
        });
      }
    } else {
      toast.error('No moves to undo!');
    }
  };

  const handleReset = () => {
    game.reset();
    setMoves([]);
    setActivePlayer('w');
    setPosition(game.fen());
    setCapturedPieces({ w: [], b: [] });
    setIsPaused(false);
    setResetTimers(true);
    toast.success('Game reset!');
  };

  const handleCheckmate = (winner) => {
    toast.success(`${winner} wins by checkmate!`);
    setTimeout(() => {
      handleReset();
    }, 3000);
  };

  const handleTimeOut = (player) => {
    toast.success(`${player === 'w' ? 'White' : 'Black'} ran out of time!`);
    setActivePlayer(player === 'w' ? 'b' : 'w');
    setResetTimers(true);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) toast.success("game paused")
    else toast.success("game resumed");
  };

  const increaseBoardSize = () => {
    setBoardSize(boardSize + 50);
  };

  const decreaseBoardSize = () => {
    setBoardSize(boardSize - 50);
  };

  useEffect(() => {
    if (resetTimers) {
      setResetTimers(false);
    }
  }, [resetTimers]);

  return (
    <div className="app-container">
      <div className="chessboard-container">
        <ChessBoard
          game={game}
          position={position}
          onMove={handleMove}
          onCheckmate={handleCheckmate}
          boardSize={boardSize}
          onCapture={handleCapture}
          isPaused={isPaused}
        />
      </div>
      <div className="info-container">
        <h2 className="text-xl font-semibold">Current Player: {activePlayer === 'w' ? 'White' : 'Black'}</h2>
        <Timers activePlayer={activePlayer} onTimeOut={handleTimeOut} isPaused={isPaused} resetTimers={resetTimers} />
        <h2 className="text-xl font-semibold">Move List</h2>
        <MoveList moves={moves} />
        <h3>Captured Pieces</h3>
        <CapturedPieces pieces={capturedPieces.w} label="White" />
        <CapturedPieces pieces={capturedPieces.b} label="Black" />
        <div className="mt-2">
          <button onClick={handleUndo} className="p-2 bg-blue-500 text-white rounded mr-2">Undo</button>
          <button onClick={handleReset} className="p-2 bg-red-500 text-white rounded">Reset</button>
          <button onClick={togglePause} className="p-2 bg-gray-500 text-white rounded ml-2">{isPaused ? 'Resume' : 'Pause'}</button>
        </div>
        <div className="mt-2">
          <button onClick={increaseBoardSize} className="p-2 bg-green-500 text-white rounded mr-2">Increase Board Size</button>
          <button onClick={decreaseBoardSize} className="p-2 bg-yellow-500 text-white rounded">Decrease Board Size</button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
