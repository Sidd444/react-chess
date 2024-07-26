import React from 'react';

const pieceIcons = {
    p: '♙', n: '♘', b: '♗', r: '♖', q: '♕', k: '♔',
    P: '♟', N: '♞', B: '♝', R: '♜', Q: '♛', K: '♚'
  };

const CapturedPieces = ({ pieces, label }) => {
  return (
    <div className="captured-pieces">
      <h3 className='inline font-bold'>{label}</h3>
      <span className="pieces">
        {pieces.map((piece, index) => (
          <span key={index} className={`piece ${piece}`}>
            {pieceIcons[piece]}
          </span>
        ))}
      </span>
    </div>
  );
};

export default CapturedPieces;
