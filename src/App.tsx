import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-400">
      <h1 className="text-4xl font-bold mb-4">Vite + React + Tailwind CSS</h1>
    </div>
  );
}

export default App;
