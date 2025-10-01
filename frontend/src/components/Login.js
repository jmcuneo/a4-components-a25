import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            setMessage('Please enter both username and password');
            setMessageType('danger');
            return;
        }

        setIsLoading(true);
        setMessage('Logging in...');
        setMessageType('info');

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (result.success) {
                const successMessage = result.isNewUser ?
                    'Account created successfully! Redirecting...' :
                    'Login successful! Redirecting...';

                setMessage(successMessage);
                setMessageType('success');

                setTimeout(() => {
                    onLogin(username);
                }, 1500);
            } else {
                setMessage(result.message);
                setMessageType('danger');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Login failed. Please try again.');
            setMessageType('danger');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-primary text-white text-center py-4">
                                <div className="d-flex justify-content-center align-items-center mb-3">
                                    <i className="bi bi-car-front fs-1 me-3"></i>
                                    <div>
                                        <h2 className="mb-1 fw-bold">Car Inventory</h2>
                                        <p className="mb-0 opacity-75">Manage Your Vehicle Collection</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="username" className="form-label fw-semibold">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter your username"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 py-3 fw-semibold"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Login / Create Account
                                            </>
                                        )}
                                    </button>
                                </form>
                                {message && (
                                    <div className={`mt-4 alert alert-${messageType} alert-dismissible fade show`}>
                                        <div className="d-flex align-items-center">
                                            <i className={`bi ${
                                                messageType === 'success' ? 'bi-check-circle-fill' :
                                                    messageType === 'danger' ? 'bi-exclamation-triangle-fill' :
                                                        'bi-info-circle-fill'
                                            } me-2`}></i>
                                            <span>{message}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setMessage('')}
                                        ></button>
                                    </div>
                                )}
                            </div>
                            <div className="card-footer text-center py-3">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    New users will have accounts created automatically
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;