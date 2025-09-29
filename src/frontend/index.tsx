import "./index.css";

import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Routes, Route, Navigate, Outlet } from "react-router";

import Home from "@/Home";
import Login from "@/Login";
import Register from "@/Register";
import Portal from "@/Portal";

import { UserContext, UserProvider} from "@/contexts/UserContext"

const AuthRoute = () => {
  const {user, setUser} = useContext(UserContext);
  
  return (
    user ? <Outlet/> : <Navigate to='/'/>
  )
}

const NoAuthRoute = () => {
  const {user, setUser} = useContext(UserContext);
  
  return (
    user ? <Navigate to='/portal'/> : <Outlet/>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <BrowserRouter>
      {/* Routes */}
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<NoAuthRoute/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<AuthRoute/>}>
            <Route path="/portal" element={<Portal />} />
          </Route>
        </Routes>
      </UserProvider>
      {/* Your app content */}
    </BrowserRouter>
  </React.StrictMode>,
);
