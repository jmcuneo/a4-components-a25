import { useState } from "react";
import "./App.css";

function App( {children} ) {

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
      </div>
      <div className="flex justify-center m-5">
        {children}
      </div>
    </div>
  );
}
export default App;
