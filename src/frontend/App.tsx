import { useState } from "react";

import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0);

  return (
    <Button asChild>
      <a href="/login">Login</a>
    </Button>
  );
}

export default App;
