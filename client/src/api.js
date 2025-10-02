export async function tryFetchSession() {
    try {
        const res = await fetch("/session");
        if (!res.ok) return { loggedIn: false };
        return await res.json();
    } catch {
        return { loggedIn: false };
    }
}

export async function safeLogout() {
    try {
        await fetch("/logout", { method: "POST" });
    } catch (err) {
        console.error("Logout failed", err);
    }
}
