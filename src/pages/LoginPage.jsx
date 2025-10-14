import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const submitLogin = async (e) => {
        e.preventDefault()
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        if (res.ok) {
            navigate('/library')
        } else {
            const msg = await res.json()
            setMessage(msg.error || 'Login failed')
        }
    }

    return (
        <section className="section">
            <div className="container has-text-centered">
                <h1 className="title">Welcome to Your Library</h1>
                <p className="subtitle">Please log in to continue</p>

                <div className="box" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <form onSubmit={submitLogin}>
                        <div className="field">
                            <label className="label">Username</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <p className="has-text-danger">{message}</p>

                        <button type="submit" className="button is-link is-fullwidth">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
