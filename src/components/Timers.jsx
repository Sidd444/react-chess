import React, { useEffect, useState } from 'react';

const Timer = ({ isActive, onTimeOut, reset }) => {
  const [time, setTime] = useState(600);

  useEffect(() => {
    if (reset) {
      setTime(600); 
      return;
    }

    if (!isActive) return;

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeOut();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeOut, reset]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return <div>{formatTime(time)}</div>;
};

const Timers = ({ activePlayer, onTimeOut, isPaused, resetTimers }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="font-bold">White Timer:</span>
        <div className={`p-2 border rounded ${activePlayer === 'w' ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
          <Timer isActive={activePlayer === 'w' && !isPaused} onTimeOut={() => onTimeOut('w')} reset={resetTimers} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold">Black Timer:</span>
        <div className={`p-2 border rounded ${activePlayer === 'b' ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
          <Timer isActive={activePlayer === 'b' && !isPaused} onTimeOut={() => onTimeOut('b')} reset={resetTimers} />
        </div>
      </div>
    </div>
  );
};

export default Timers;
