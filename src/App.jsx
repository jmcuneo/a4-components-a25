import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import LibraryPage from './pages/LibraryPage'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/library" element={<LibraryPage />} />
        </Routes>
    )
}
