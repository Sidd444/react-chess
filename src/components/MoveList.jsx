import React from 'react';

const MoveList = ({ moves }) => {
  return (
    <div className="move-list overflow-x-auto h-64 border-2">
      <ul>
        {moves.map((move, index) => (
          <li key={index}>
            {move.player === 'w' ? 'White' : 'Black'}: {move.san}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoveList;
