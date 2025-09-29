import { Button } from "@/components/ui/button"

function App() {
  return (
    <>
      <h1>Sign Up</h1>
      <Button asChild>
        <a href="/login">Login</a>
      </Button>
      <Button asChild>
        <a href="/register">Sign Up</a>
      </Button>
      <Button asChild>
        <a href="/auth/github">Sign Up with Github</a>
      </Button>
    </>
  );
}

export default App;
