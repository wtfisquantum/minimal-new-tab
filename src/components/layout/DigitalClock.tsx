import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const [nums, suffix] = timeString.split(' ');

  return (
    <div className="flex flex-col items-center mb-8 fade-in relative z-10">
      <h1 className="flex inline-flex justify-center items-baseline gap-3 text-7xl md:text-8xl font-semibold font-['Rubik'] text-white tracking-wide leading-none drop-shadow-lg">
        {nums}
        <span className="text-7xl font-['Rubik'] font-bold text-zinc-400">{suffix}</span>
      </h1>
    </div>
  );
};

export default DigitalClock;
