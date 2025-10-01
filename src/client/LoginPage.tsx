import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
    setUsername: (name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setUsername }) => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return alert("Please enter a username.");
        setUsername(trimmed);
        navigate("/", { replace: true });
    };

    return (
        <div className="flex items-center justify-center h-screen bg-pink-50">
            <form
                onSubmit={handleLogin}
                className="bg-pink-200 p-8 rounded shadow flex flex-col space-y-4"
            >
                <h1 className="text-2xl font-bold text-pink-900">Login</h1>
                <input
                    type="text"
                    placeholder="Enter your username"
                    className="p-2 rounded border border-gray-300"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-pink-400 text-white rounded py-2 hover:bg-pink-500"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
