// Rohan Gladson 
// CS 4241: Webware: Computational Technology for Network Information Systems
// api.ts

// The purpose of this file is so that we can to where a small helper
// layer can to communicate to the Express server APIs

// Works with Vite proxy in dev and same-origin in prod
const API_BASE = "/api"; 

// Base function to make requests
async function request(path: string, options: RequestInit = {}) {
  // ensure exactly one slash between base and path
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // To include cookies for session
  });

  if (!res.ok) {
    let errMsg = `Request failed with ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) errMsg = data.error;
    } catch {
      /* ignore JSON parse errors */
    }
    throw new Error(errMsg);
  } 
  try {
    return await res.json();
  } catch {
    return null; // In place, just in case an endpoint returns no JSON body
  }
}

// Now, we then have the exported API calls
export const api = {
  // Checking to see who the user is?
  me: () => request("/me"),

  // Workout endpoints
  workouts: {
    list: () => request("/workouts"),
    add: (workout: any) =>
      request("/workouts", {
        method: "POST",
        body: JSON.stringify(workout),
      }),
    update: (update: any) =>
      request("/update", {
        method: "POST",
        body: JSON.stringify(update),
      }),
    delete: (index: number) =>
      request("/delete", {
        method: "POST",
        body: JSON.stringify({ index }),
      }),
  },

  // Logout
  logout: () =>
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
      return null;
    }),
};