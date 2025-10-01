import React, { useState, useEffect } from 'react'

const Todo = props => (
  <li>{props.name} : 
    <input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.name, e.target.checked ) }/>
  </li>
)

const App = () => {
  // create react states //
  // login credentials
  const [auth, setAuth] = useState( { authenticated:false, userId:null } );
  const [username, setUsername] = useState( '' );
  const [password, setPassword] = useState( '' );

  // orders
  const [orders, setOrders] = useState( [] );
  const [yourname, setYourname] = useState( '' );
  const [yourdrink, setYourdrink] = useState( '' );
  const [yourfood, setYourfood] = useState( '' );
  
  // editing - modify existing order
  const [editingId, setEditingId] = useState( null );
  const [editDrink, setEditDrink] = useState( '' );
  const [editFood, setEditFood] = useState( '' ); 
  
  // helper to call fetches
async function api(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function loadAuth() {
  const me = await api('/auth/me');           // { authenticated, userId }
  if (!me.authenticated) {
    setAuth(me);
    return;
  }
  // fetch full profile to get username, createdAt, etc.
  const prof = await api('/auth/profile');    // { ok: true, user: {...} }
  setAuth({
    ...me,
    username: prof?.user?.username || '',
    createdAt: prof?.user?.createdAt || null,
  });

  const r = await api('/results');
  setOrders(r.data || []);
}

useEffect(() => { loadAuth().catch(console.error); }, []);

// actions //
// login
async function login(e) {
  e?.preventDefault();
  await api('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
  setUsername(''); setPassword('');
  await loadAuth();               // refresh auth + orders
}

// logout
async function logout() {
  await api('/auth/logout', { method: 'POST' });
  setAuth({ authenticated: false, userId: null });
  setOrders([]);
}

// submit – create a new order
async function submitOrder(e) {
  e?.preventDefault();
  const data = await api('/submit', {
    method: 'POST',
    body: JSON.stringify({ yourname, yourdrink, yourfood }),
  });
  setOrders(data?.data || []);
  setYourname(''); setYourdrink(''); setYourfood('');
}

// edit existing
function startEdit(order) { // on click this will run, detect change in value
  setEditingId(order._id); // mark row being edited            
  setEditDrink(order.drink || ''); // prefil inputs with current vals
  setEditFood(order.food || '');
}

async function saveEdit() {
  if (!editingId) return;
  const data = await api('/edit', {
    method: 'POST',
    body: JSON.stringify({ id: editingId, yourdrink: editDrink, yourfood: editFood }),
  });
  setOrders(data?.data || []); // return updated list
  setEditingId(null);
}

function cancelEdit() {
  setEditingId(null);
}

// DELETE
async function deleteOrder(id) {
  const data = await api('/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
  setOrders(data?.data || []);
}


  // UI section

  // if NOT logged in, show login form
  if( !auth.authenticated ) {
    return (
      <div className="min-h-screen bg-coffee-800 text-white font-handlee">
        <header className="bg-coffee-900/80 backdrop-blur supports-[backdrop-filter]:bg-coffee-900/60">
          <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-pacifico tracking-wide">
              Welcome to our Coffee Shop! <span aria-hidden="true">☕️</span>
            </h1>
            <nav aria-label="Primary" className="sm:block">
              <ul className="flex gap-4 text-base font-montserrat"></ul>
            </nav>
          </div>
      </header>

      {/* login section */}
      <section id="login-section" aria-labelledby="login-heading" className="bg-coffee-900/40 rounded-2xl shadow-cozy p-6">
        <h2 id="login-heading" className="font-pacifico text-2xl md:text-3xl mb-4">
          Please log in to place an order!
        </h2>
        <form onSubmit={login} className="grid gap-4 max-w-lg">
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2"
          />
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2"
          />
          <button type="submit" className="rounded-2xl bg-cream text-coffee-900 px-4 py-2">Log in / Create account</button>
        </form>

      </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-coffee-800 text-white font-handlee">
      <header className="bg-coffee-900/80 backdrop-blur supports-[backdrop-filter]:bg-coffee-900/60">
      <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-pacifico tracking-wide">Welcome to our Coffee Shop! <span aria-hidden="true">☕️</span></h1>
        <nav aria-label="Primary" className="sm:block">
          <ul className="flex gap-4 text-base font-montserrat">
          </ul>
        </nav>
      </div>
    </header>

    <main id="main" className="mx-auto max-w-5xl px-4 py-8 space-y-8">

       {/* <!-- User info bar (hidden until we fetch profile) --> */}
      <div className="mb-3 text-sm border border-coffee rounded-md p-3" aria-live="polite">
        Signed in as <span className="font-semibold">{auth.username}</span>
        {' '}• Account created{' '}
        <time>{auth.createdAt ? new Date(auth.createdAt).toLocaleString() : ''}</time>
      </div>


      {/* <!-- App section (hidden until user logs in) --> */}
      <section id="app"aria-labelledby="menu-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="menu-heading" className="font-pacifico text-2xl md:text-3xl">Our Fall Menu <span aria-hidden="true">🍂</span></h2>
          <button id="logout" type="button" onClick={logout} className="anim-soft inline-flex items-center justify-center rounded-2xl bg-cream text-coffee-900 font-montserrat font-semibold px-4 py-2 focus-visible:outline-none focus-visible:ring focus-visible:ring-cream/70" aria-label="Log out">Logout</button>
        </div>

        {/* <!-- Menu --> */}
        <div id="menu" className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl border-4 border-dotted border-cream p-5 bg-coffee-900/30 shadow-cozy" aria-labelledby="drinks-heading">
            <h3 id="drinks-heading" className="font-pacifico text-xl mb-2">Drinks</h3>
            <ul className="list-outside list-disc ps-5 space-y-1">
              {/* <!-- aria-hidden = allows for screen reader to ignore emojis --> */}
              <li>Latte <span aria-hidden="true">☕</span></li>
              <li>Tea <span aria-hidden="true">🍵</span></li>
              <li>Iced Coffee <span aria-hidden="true">🧊</span></li>
              <li>Hot Coffee <span aria-hidden="true">☕</span></li>
              <li>Hot Chocolate <span aria-hidden="true">🍫</span></li>
              <li>Frappuccino <span aria-hidden="true">🥤</span></li>
              <li>Refresher <span aria-hidden="true">🍓</span></li>
            </ul>
          </section>

          <section className="rounded-2xl border-4 border-dotted border-cream p-5 bg-coffee-900/30 shadow-cozy" aria-labelledby="food-heading">
            <h3 id="food-heading" className="font-pacifico text-xl mb-2">Food</h3>
            <ul className="list-outside list-disc ps-5 space-y-1">
              <li>Bagel <span aria-hidden="true">🥯</span></li>
              <li>Sandwich <span aria-hidden="true">🥪</span></li>
              <li>Cake <span aria-hidden="true">🍰</span></li>
              <li>Pastry <span aria-hidden="true">🥐</span></li>
            </ul>
          </section>

          {/* Order form */}
           <section id="order" className="rounded-2xl border-4 border-dotted border-cream p-5 bg-coffee-900/30 shadow-cozy" aria-labelledby="order-heading">
            <h3 id="order-heading" className="font-pacifico text-xl mb-3">Order here</h3>
            <form onSubmit={submitOrder} className="grid gap-3">
              <input id="yourname" value={yourname} onChange={e => setYourname(e.target.value)} placeholder="Ceci"
      className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"/>
              <input id="yourdrink" value={yourdrink} onChange={e => setYourdrink(e.target.value)} placeholder="Latte"
      className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"/>
              <input id="yourfood"  value={yourfood}  onChange={e => setYourfood(e.target.value)} placeholder="Pastry"
      className="w-full rounded-2xl bg-white text-coffee-900 px-4 py-2 shadow-sm outline-none ring-2 ring-transparent focus:ring-cream"/>
              <button id="submit-btn" type="submit" className="rounded-2xl bg-cream text-coffee-900 px-4 py-2">Submit order</button>
            </form>

          </section>
        </div>

         {/* <!-- add table for results --> */}
        <section id="results" className="rounded-2xl border-4 border-dotted border-cream p-5 bg-coffee-900/30 shadow-cozy" aria-labelledby="results-heading">
          <div className="flex items-center justify-between mb-3">
            <h3 id="results-heading" className="font-pacifico text-xl">All Orders (results)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm font-montserrat border border-cream/70 rounded-xl overflow-hidden">
              <caption className="sr-only">Table of all submitted coffee shop orders</caption>
              <thead className="bg-coffee-900">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left border border-cream">ID</th>
                  <th scope="col" className="px-3 py-2 text-left border border-cream">Name</th>
                  <th scope="col" className="px-3 py-2 text-left border border-cream">Drink</th>
                  <th scope="col" className="px-3 py-2 text-left border border-cream">Food</th>
                  <th scope="col" className="px-3 py-2 text-left border border-cream">Created</th>
                  <th scope="col" className="px-3 py-2 text-left border border-cream">Order Prep time (min)</th>
                  <th scope="col" className="px-3 py-2 text-left border border-cream">Edit / Delete</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const isEditing = editingId === o._id; // or o.id
                  return (
                    <tr key={o._id} className="border-t border-cream/40">
                      <td className="px-3 py-2 border border-cream">{o._id}</td>
                      <td className="px-3 py-2 border border-cream">{o.name}</td>

                      <td className="px-3 py-2 border border-cream">
                        {isEditing ? (
                          <input
                            className="w-full rounded-2xl bg-white text-coffee-900 px-2 py-1"
                            value={editDrink}
                            onChange={e => setEditDrink(e.target.value)}
                          />
                        ) : (
                          o.drink
                        )}
                      </td>

                      <td className="px-3 py-2 border border-cream">
                        {isEditing ? (
                          <input
                            className="w-full rounded-2xl bg-white text-coffee-900 px-2 py-1"
                            value={editFood}
                            onChange={e => setEditFood(e.target.value)}
                          />
                        ) : (
                          o.food
                        )}
                      </td>

                      <td className="px-3 py-2 border border-cream">
                        {o.createdOn ? new Date(o.createdOn).toLocaleString() : '-'}
                      </td>
                      <td className="px-3 py-2 border border-cream">{o.readyInMin}</td>
                      <td className="px-3 py-2 border border-cream whitespace-nowrap">
                        {isEditing ? (
                          <>
                            <button className="mr-2 underline" onClick={saveEdit}>Save</button>
                            <button className="underline" onClick={cancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="mr-2 underline" onClick={() => startEdit(o)}>Edit</button>
                            <button className="underline" onClick={() => deleteOrder(o._id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center opacity-80">No orders yet.</td>
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

export default App