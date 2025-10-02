import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import MainWindow from './pages/MainWindow.jsx'
import LoggedFilms from './pages/LoggedFilms.jsx'
import LoginWindow from './pages/LoginWindow.jsx'

function App() {
  const [page, setPage] = useState("main");
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginWindow />} />
          <Route path="/main" element={<MainWindow />} />
          <Route path="/logs" element={<LoggedFilms />} />
        </Routes>
      </Router>
    </>
  )
}

export default App;
