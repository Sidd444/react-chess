import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import toast, { Toaster } from 'react-hot-toast';

const ChessBoard = ({ game, position, onMove, onCheckmate, boardSize, onCapture, isPaused }) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    if (isPaused) {
      toast.error("Resume game to make moves");
      return false;
    }

    const legalMove = game
      .moves({ square: sourceSquare, verbose: true })
      .some((m) => m.to === targetSquare);

    if (!legalMove) {
      toast.error('Illegal move!');
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', 
    });

    if (move === null) {
      toast.error('Illegal move!');
      return false;
    }

    if (move.captured) {
      onCapture(move);
    }

    onMove(move);

    if (game.in_checkmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      toast.success(`${winner} wins by checkmate!`);
      onCheckmate(winner);
    } else if (game.in_check()) {
      toast.success("Check!");
    }

    return true;
  };

  const handleSquareClick = (square) => {
    setSelectedSquare(square);
    const moves = game.moves({ square, verbose: true }).map((move) => move.to);
    setLegalMoves(moves);
  };

  useEffect(() => {
    if (game.inCheck()) {
      toast.success("Check!");
    }
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      toast.success(`${winner} wins by checkmate!`);
      onCheckmate(winner);
    }
  }, [position]);

  return (
    <>
      <Chessboard
        position={position}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
        boardOrientation="white"
        boardWidth={boardSize}
        customSquareStyles={legalMoves.reduce(
          (acc, move) => {
            acc[move] = { backgroundColor: 'rgba(0, 255, 0, 0.4)' };
            return acc;
          },
          { [selectedSquare]: { backgroundColor: 'rgba(0, 0, 255, 0.4)' } }
        )}
      />
      <Toaster />
    </>
  );
};

export default ChessBoard;
