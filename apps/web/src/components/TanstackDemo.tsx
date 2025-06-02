import { useSuspenseQuery } from '@tanstack/react-query';

const fetchFakeData = () =>
  new Promise<string>((resolve) => setTimeout(() => resolve('Hello from TanStack Query!'), 1500));

export const TanstackDemo = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['fakeData'],
    queryFn: fetchFakeData,
  });
  return <div className="p-4 text-green-700">{data}</div>;
};
