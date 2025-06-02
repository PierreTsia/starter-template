import { useState } from 'react';

export const BuggyCounter = () => {
  const [counter, setCounter] = useState(0);

  if (counter === 5) {
    // Simulate a JavaScript error
    throw new Error('I crashed!');
  }

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl mb-4">Buggy Counter: {counter}</h2>
      <button
        onClick={() => setCounter((c) => c + 1)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Increment
      </button>
    </div>
  );
};
