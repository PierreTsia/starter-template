import { useState } from 'react';

import { Button } from '@/components/ui/button';

export const BuggyCounter = () => {
  const [count, setCount] = useState(0);
  if (count > 5) {
    throw new Error('You clicked too many times! This is a test error.');
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg">Count: {count}</p>
      <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
      <p className="text-sm text-muted-foreground">Click more than 5 times to trigger an error.</p>
    </div>
  );
};
