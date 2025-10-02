import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Account() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        (async () => {
            const res = await fetch("/session");
            const data = await res.json();
            setSession(data);
        })();
    }, []);

    if (!session) {
        return (
            <>
                <Navbar />
                <div className="form-card">
                    <p>Checking session...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="form-card">
                {session.loggedIn ? (
                    <>
                        <p>Signed in as <strong>{session.user.username}</strong></p>
                        <button className="btn mt-4" onClick={async () => {
                            await fetch("/logout", { method: "POST" });
                            window.location.href = "/";
                        }}>Sign Out</button>
                    </>
                ) : (
                    <>
                        <p>You are not signed in.</p>
                        <div className="btn-group">
                            <a href="/login" className="btn">Login</a>
                            <a href="/signup" className="btn">Sign Up</a>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
