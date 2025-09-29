import React, { useEffect, useState } from 'react';

export default function App() {
  // auth
  const [auth, setAuth] = useState({ authenticated: false, userId: null });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // orders
  const [orders, setOrders] = useState([]);
  const [yourname, setYourname] = useState('');
  const [yourdrink, setYourdrink] = useState('');
  const [yourfood, setYourfood] = useState('');

  // ---- helper that ALWAYS sends cookies and respects options ----
  async function api(path, options = {}) {
    const res = await fetch(path, {
      credentials: 'include',
      // spread options so method/body are used
      ...options,
      // merge headers safely
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
      throw new Error(msg);
    }
    // some endpoints might return empty body; handle both
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
  }

  async function loadAuth() {
    const me = await api('/auth/me');
    setAuth(me);
    if (me.authenticated) {
      const r = await api('/results');
      setOrders(r.data || []);
    }
  }

  useEffect(() => { loadAuth().catch(console.error); }, []);

  // ---- actions ----
  async function onLogin(e) {
    e.preventDefault();
    await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setUsername(''); setPassword('');
    await loadAuth();
  }

  async function onLogout() {
    await api('/auth/logout', { method: 'POST' });
    setAuth({ authenticated: false, userId: null });
    setOrders([]);
  }

  async function onSubmitOrder(e) {
    e.preventDefault();
    const r = await api('/submit', {
      method: 'POST',
      body: JSON.stringify({ yourname, yourdrink, yourfood })
    });
    setOrders(r.data || []);
    setYourname(''); setYourdrink(''); setYourfood('');
  }

  // ---------- UI (NOT LOGGED IN) ----------
  if (!auth.authenticated) {
    return (
      <div className="min-h-screen bg-coffee-800 text-white font-handlee">
        <header className="bg-coffee-900/80 backdrop-blur supports-[backdrop-filter]:bg-coffee-900/60">
          <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-pacifico tracking-wide">
              Welcome to our Coffee Shop! <span aria-hidden="true">☕️</span>
            </h1>
            <nav aria-label="Primary" className="hidden sm:block">
              <ul className="flex gap-4 text-base font-montserrat"></ul>
            </nav>
          </div>
        </header>

        {/* login section */}
        <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
          <section id="login-section" aria-labelledby="login-heading" className="bg-coffee-900/40 rounded-2xl shadow-cozy p-6">
            <h2 id="login-heading" className="font-pacifico text-2xl md:text-3xl mb-4">
              Please log in to place an order!
            </h2>
            <form id="login-form" className="grid gap-4 max-w-lg" aria-describedby="login-help" onSubmit={onLogin}>
              <div>
                <label htmlFor="login-username" className="block text-sm font-montserrat mb-1">
                  Username <span className="text-cream">*</span>
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  className="w-full rounded-2xl bg-white text-coffee-900 placeholder:opacity-60 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"
                  placeholder="barista_123"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm font-montserrat mb-1">
                  Password <span className="text-cream">*</span>
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl bg-white text-coffee-900 placeholder:opacity-60 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"
                  placeholder="password1"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <p id="login-help" className="text-sm opacity-90 font-montserrat">
                New here? Use the form to create an account—no separate signup needed.
              </p>
              <div className="flex items-center gap-3">
                <button type="submit" className="anim-soft inline-flex items-center justify-center rounded-2xl bg-cream text-coffee-900 font-montserrat font-semibold px-4 py-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-cream/70">
                  Log in / Create account
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    );
  }

  // ---------- UI (LOGGED IN) ----------
  return (
    <div className="min-h-screen bg-coffee-800 text-white font-handlee">
      <header className="bg-coffee-900/80 backdrop-blur supports-[backdrop-filter]:bg-coffee-900/60">
        <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-pacifico tracking-wide">
            Welcome to our Coffee Shop! <span aria-hidden="true">☕️</span>
          </h1>
          <nav aria-label="Primary" className="hidden sm:block">
            <ul className="flex gap-4 text-base font-montserrat"></ul>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <section aria-labelledby="menu-heading" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 id="menu-heading" className="font-pacifico text-2xl md:text-3xl">
              Our Fall Menu <span aria-hidden="true">🍂</span>
            </h2>
            <button
              type="button"
              onClick={onLogout}
              className="anim-soft inline-flex items-center justify-center rounded-2xl bg-cream text-coffee-900 font-montserrat font-semibold px-4 py-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-cream/70"
              aria-label="Log out"
            >
              Logout
            </button>
          </div>

          {/* Order form */}
          <section id="order" className="rounded-2xl border-4 border-dotted border-cream p-5 bg-coffee-900/30 shadow-cozy" aria-labelledby="order-heading">
            <h3 id="order-heading" className="font-pacifico text-xl mb-3">Order here</h3>
            <form className="grid gap-3" aria-describedby="order-help" onSubmit={onSubmitOrder}>
              <div>
                <label htmlFor="yourname" className="block text-sm font-montserrat mb-1">Your name</label>
                <input
                  id="yourname"
                  name="name"
                  type="text"
                  className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"
                  placeholder="Jim"
                  value={yourname}
                  onChange={e => setYourname(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="yourdrink" className="block text-sm font-montserrat mb-1">Your drink</label>
                <input
                  id="yourdrink"
                  name="drink"
                  type="text"
                  className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"
                  placeholder="Iced latte"
                  value={yourdrink}
                  onChange={e => setYourdrink(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="yourfood" className="block text-sm font-montserrat mb-1">Your food</label>
                <input
                  id="yourfood"
                  name="food"
                  type="text"
                  className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"
                  placeholder="Bagel"
                  value={yourfood}
                  onChange={e => setYourfood(e.target.value)}
                />
              </div>
              <p id="order-help" className="text-sm opacity-90 font-montserrat">Submit to add your order to the list.</p>
              <div className="flex items-center gap-3">
                <button id="submit-btn" type="submit" className="anim-soft inline-flex items-center justify-center rounded-2xl bg-cream text-coffee-900 font-montserrat font-semibold px-4 py-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-cream/70">
                  Submit order
                </button>
              </div>
            </form>
          </section>

          {/* Results */}
          <section id="results" className="rounded-2xl border-4 border-dotted border-cream p-5 bg-coffee-900/30 shadow-cozy" aria-labelledby="results-heading">
            <div className="flex items-center justify-between mb-3">
              <h3 id="results-heading" className="font-pacifico text-xl">All Orders (results)</h3>
              <button
                onClick={() => api('/results').then(r => setOrders(r.data || []))}
                className="anim-soft inline-flex items-center justify-center rounded-2xl bg-cream text-coffee-900 font-montserrat font-semibold px-3 py-1"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm font-montserrat border border-cream/70 rounded-xl overflow-hidden">
                <caption className="sr-only">Table of all submitted coffee shop orders</caption>
                <thead className="bg-coffee-900">
                  <tr>
                    <th className="px-3 py-2 text-left border border-cream">ID</th>
                    <th className="px-3 py-2 text-left border border-cream">Name</th>
                    <th className="px-3 py-2 text-left border border-cream">Drink</th>
                    <th className="px-3 py-2 text-left border border-cream">Food</th>
                    <th className="px-3 py-2 text-left border border-cream">Created</th>
                    <th className="px-3 py-2 text-left border border-cream">Ready (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} className="border-t border-cream/40">
                      <td className="px-3 py-2 border border-cream">{o._id}</td>
                      <td className="px-3 py-2 border border-cream">{o.name}</td>
                      <td className="px-3 py-2 border border-cream">{o.drink}</td>
                      <td className="px-3 py-2 border border-cream">{o.food}</td>
                      <td className="px-3 py-2 border border-cream">{o.createdOn ? new Date(o.createdOn).toLocaleString() : '-'}</td>
                      <td className="px-3 py-2 border border-cream">{o.readyInMin}</td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center opacity-80">No orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}