import {useState} from 'react'
import {BrowserRouter, Routes, Route, Navigate, HashRouter} from "react-router-dom";
import "./css/App.css";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import User_content from "./components/User_content.jsx";

function App() {
    return (
        <div className="App">
            <HashRouter>
                <Routes>
                    <Route exact path="/Login" element={<Login/>}/>
                    <Route exact path="/" element={<Login/>} />
                    <Route exact path="/Register" element={<Register/>}/>
                    <Route exact path="/User_content" element={<User_content/>}/>
                    <Route exact path="*" element={<Login/>}/>
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;