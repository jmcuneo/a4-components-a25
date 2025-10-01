// Rohan Gladson 
// CS 4241: Webware: Computational Technology for Network Information Systems
// App.tsx

import { useEffect, useState } from 'react'
import { api } from './api'

// Variable Types
type Workout = {
  exercise: string
  sets: number
  reps: number
  weight: number
  type: 'strength' | 'activity'
  bodyweight: boolean
  notes: string
  volume?: number | null
}

// Top navigation bar with greeting and logout
function Topbar({ user, onLogout }:{ user:any; onLogout:()=>void }) {
  return (
    <div className="topbar">
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        {/* Avatar & username */}
        <img src={user.avatar || '/img/github-mark.svg'} alt="" width={32} height={32}/>
        <strong className="greet">Welcome, {user.displayName || user.username}!</strong>
      </div>
      {/* Logout form calls API, then follows with refreshing state */}
      <form onSubmit={async e=>{ e.preventDefault(); await api.logout(); onLogout(); }}>
        <button className="secondary">Logout</button>
      </form>
    </div>
  )
}

// Form to create or edit a workout
function WorkoutForm({
  initial, onSubmit, onCancel
}:{ initial?:Workout; onSubmit:(w:Workout)=>void; onCancel:()=>void }) {

  // Form state (prefilled when editing, empty when adding)
  const [f, setF] = useState<Workout>(initial ?? {
    exercise:'', sets:0, reps:0, weight:0, type:'strength', bodyweight:false, notes:''
  })
  const set = (k:keyof Workout, v:any)=> setF(prev=>({ ...prev, [k]: v }))
  
  const validate = () => {
    const hasLetter = /[a-z]/i.test(f.exercise)
    if (!hasLetter || f.exercise.trim().length < 2) return 'Exercise must include a letter and be less 2 characters.'
    if (f.type === 'activity') {
      if (f.sets || f.reps || f.weight) return 'Activity requires sets, reps, and weight to be 0.'
    } else {
      if (f.sets <= 0 || f.reps <= 0 || f.weight < 0) return 'Strength needs the following categories greater than 0: sets, reps, weight.'
    }
    if (f.sets < 0 || f.reps < 0 || f.weight < 0) return 'Numbers must be non-negative.'
    return ''
  }

  return (
    <form onSubmit={e=>{ e.preventDefault(); const err = validate(); if (err) return alert(err); onSubmit(f) }}>
      {/* Basic fields */}
      <div className="grid">
        <label>Exercise
          <input value={f.exercise} onChange={e=>set('exercise', e.target.value)}
                 required pattern=".*[A-Za-z].*" placeholder="e.g., Bench Press"/>
        </label>
        <label>Sets
          <input type="number" min={0} value={f.sets} onChange={e=>set('sets', +e.target.value)} />
        </label>
        <label>Reps
          <input type="number" min={0} value={f.reps} onChange={e=>set('reps', +e.target.value)} />
        </label>
        <label>Weight (lbs)
          <input type="number" min={0} value={f.weight} onChange={e=>set('weight', +e.target.value)} />
        </label>
      </div>

      {/* Radio buttons for type */}
      <fieldset>
        <legend>Type</legend>
        <label><input type="radio" name="type" checked={f.type==='strength'} onChange={()=>set('type','strength')}/> Strength</label>
        <label><input type="radio" name="type" checked={f.type==='activity'} onChange={()=>set('type','activity')}/> Activity</label>
      </fieldset>

      {/* Bodyweight checkbox */}
      <label><input type="checkbox" checked={f.bodyweight} onChange={e=>set('bodyweight', e.target.checked)}/> Bodyweight movement</label>

      {/* Notes field */}
      <label>Notes (optional)
        <textarea value={f.notes} onChange={e=>set('notes', e.target.value)} maxLength={500}
                  placeholder="e.g., Played basketball 2 hours"/>
      </label>

      {/* Submit + cancel (for editing) */}
      <div style={{display:'flex',gap:8}}>
        <button>{initial ? 'Save Changes' : 'Add Workout'}</button>
        {initial && <button type="button" className="secondary" onClick={onCancel}>Cancel Edit</button>}
      </div>
    </form>
  )
}

// Table of workouts with edit and delete buttons
function WorkoutTable({
  rows, onEdit, onDelete
}:{ rows:Workout[]; onEdit:(i:number)=>void; onDelete:(i:number)=>void }) {
  const isActivity = (r:Workout) => r.type === 'activity'
  return (
    <table role="grid">
      <thead><tr>
        <th>#</th><th>Exercise</th><th>Type</th><th>BW</th>
        <th>Sets</th><th>Reps</th><th>Weight</th><th>Volume</th><th>Notes</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {/* No rows, then show placeholder */}
        {rows.length===0 && <tr><td colSpan={10}>No workouts yet.</td></tr>}
        {rows.map((r,i)=>(
          <tr key={i}>
            <td>{i+1}</td>
            <td>{r.exercise}</td>
            <td>{r.type}</td>
            <td>{r.bodyweight ? 'Correct :)' : ''}</td>
            <td>{isActivity(r) ? 'N/A' : r.sets}</td>
            <td>{isActivity(r) ? 'N/A' : r.reps}</td>
            <td>{isActivity(r) ? 'N/A' : r.weight}</td>
            <td>{isActivity(r) ? 'N/A' : (r.volume ?? (r.sets * r.reps * r.weight))}</td>
            <td>{r.notes}</td>
            <td style={{whiteSpace:'nowrap'}}>
              <button className="secondary" onClick={()=>onEdit(i)}>Edit</button>{' '}
              <button className="danger" onClick={()=>onDelete(i)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// For the Main Web-Application
export default function App() {
  // State for authentication and workouts
  const [user, setUser] = useState<any>(null)
  const [rows, setRows] = useState<Workout[] | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [flash, setFlash] = useState<string>('')

  // On first load, then check login and fetch workouts
  useEffect(() => {
    api.me()
      .then(({ user }) => {
        setUser(user)
        return api.workouts.list().then(setRows)
      })
      .catch(() => setUser(null))
  }, [])

  // If the user is not logged in, then show login screen
  if (!user) {
    return (
      <main id="login-view">
        <section>
          <img src="/img/WorkoutLog.svg" alt="Workout Log" width={96} height={96}/>
          <h1>Workout Log</h1>
          <p className="muted">Sign in with GitHub to access your logs.</p>
          <a role="button" href="/auth/github">Continue with GitHub</a>
          {flash && <p className="muted">{flash}</p>}
        </section>
      </main>
    )
  }

  const data = rows ?? []

  // Now, we transition to the main dashboard view
  return (
    <main id="app-view">
      <section>
        <Topbar user={user} onLogout={()=>{ setUser(null); setRows(null) }}/>

        {flash && <p className="muted" aria-live="polite">{flash}</p>}

        {/* Form to add or edit workouts */}
        <div className="card">
          <h3>{editIndex != null ? 'Edit Workout' : 'Add a Workout'}</h3>
          <WorkoutForm
            key={editIndex ?? -1}
            initial={editIndex != null ? data[editIndex] : undefined}
            onCancel={()=>setEditIndex(null)}
            onSubmit={async (payload) => {
              try {
                // If editing, then call update API, or else add
                const next = editIndex != null
                  ? await api.workouts.update({ index: editIndex, ...payload })
                  : await api.workouts.add(payload)
                setRows(next)
                setEditIndex(null)
                setFlash(editIndex != null ? 'Saved changes.' : 'Added workout.')
              } catch (e:any) {
                setFlash(String(e.message || e))
              }
            }}
          />
        </div>

        {/* Table of existing workouts */}
        <div className="card">
          <h3>All Workouts</h3>
          <WorkoutTable
            rows={data}
            onEdit={(i)=>setEditIndex(i)}
            onDelete={async (i)=>{
              try {
                const next = await api.workouts.delete(i)
                setRows(next)
              } catch (e:any) {
                setFlash(String(e.message || e))
              }
            }}
          />
        </div>

        <footer><small className="muted">CS 4241 | Assignment 4 | WPI</small></footer>
      </section>
    </main>
  )
}