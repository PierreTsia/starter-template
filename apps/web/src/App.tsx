import { Button } from '@/components/ui/button';

const App = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">Welcome to MyApp</h1>
        <p className="mb-6 text-muted-foreground">
          This is your shiny new home page. Start building something awesome.
        </p>
        <Button>Click me</Button>
      </main>
    </div>
  );
};

export default App;
