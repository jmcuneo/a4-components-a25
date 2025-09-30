import "./index.css";

import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Link, Routes, Route, Navigate, Outlet } from "react-router";

import { Toaster } from "@/components/ui/sonner"

import Home from "@/Home";
import Login from "@/Login";
import Register from "@/Register";
import Portal from "@/Portal";

import { UserContext, UserProvider } from "@/contexts/UserContext"
import { ThemeProvider } from "@/components/theme-provider"

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
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <BrowserRouter>
        {/* Routes */}
        <UserProvider>
          <header className="text-center mb-12">
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance font-serif"><Link to="/">Spaceship Battle Log</Link></h1>
            <p className="text-muted-foreground">Log and keep track of previous battle encounters.</p>
          </header>
          <Routes>
            <Route element={<NoAuthRoute/>}>
              <Route path="/" element={<Home />} />
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
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
