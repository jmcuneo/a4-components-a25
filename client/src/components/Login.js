import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.newAccount ? 'New account created! Login successful.' : 'Login successful.');
                onLogin({ username });
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="card shadow">
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="fas fa-car fa-3x text-primary mb-3"></i>
                        <h1 className="h3 mb-3">Car Tracker</h1>
                        <p className="text-muted">Track your car collection</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2" disabled={isLoading}>
                            <i className="fas fa-sign-in-alt me-2"></i>
                            {isLoading ? 'Loading...' : 'Login / Create Account'}
                        </button>
                    </form>

                    {message && (
                        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} mt-3`}>
                            {message}
                        </div>
                    )}

                    <div className="text-center mt-4">
                        <small className="text-muted">
                            Don't have an account? Just enter a username and password to create one automatically.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;