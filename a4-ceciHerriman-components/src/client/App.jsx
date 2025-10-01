import React, { useState, useEffect } from 'react'
import './App.css'

const Login = ({ onLoginSuccess, setUsername, onIsNewUser}) => {
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      doCreateUser: formData.get('doCreateUser') === 'on',
    };

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        console.log('User authenticated:', result);
        setUsername(result.username)

        if(result.isNewUser) {
          onIsNewUser()
        }
        
        onLoginSuccess()
      } else {
        console.error('Login failed:', result.error);
        if(result.error === "incorrectCreds") {
          setError("Incorrect username or password. Please try again.")
        }
        else {
          setError(result.error); 
        }
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('Something went wrong.');
    }
  };

  return (
  <div>
    <section className="hero is-small is-primary" role="banner">
      <div className="hero-body">
        <p className="title">Log In Page</p>
        <p className="subtitle">Movie Reviewer</p>
      </div>
    </section>

    <section>
      <div className="login-container">
        <h1 className="title is-1" style={{ fontSize: "3rem" }}>Log In</h1>

        <div className="login-form"> 
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="login-username" className="label is-medium">Username</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input is-primary is-medium"
                  type="text"
                  placeholder="Username"
                  name="username"
                  id="login-username"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="login-password" className="label is-medium">Password</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input is-primary is-medium"
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="login-password"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <div className="control checkbox-wrapper">
                <label htmlFor="login-createUser" className="checkbox is-medium">
                  <input
                    className="is-medium"
                    type="checkbox"
                    name="doCreateUser"
                    id="login-createUser"
                  />
                  Create new user if not existing
                </label>
              </div>
            </div>

            <p id="error-message" className="has-text-danger-60">
              {error}
            </p>

            <div className="field" style={{ marginTop: 50 }}>
              <div className="control">
                <button className="button is-primary is-medium" type="submit">Submit</button>
              </div>
            </div>
          </form>    
        </div>
      </div>
    </section>
  </div>
);

}

const Entry = props => {
  
  async function deleteRow( ) {

    const json = {
      _id: props._id
    };
    
    const body = JSON.stringify( json )

    const response = await fetch( "/remove", {
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: body 
    })

    const data = await response.json()

    props.onDelete()
  }

  function editRow( ) {
    props.onSetEditing({
      _id: props._id,
      name: props.name,
      year: props.year,
      plotRating: props.plotRating,
      actingRating: props.actingRating,
      musicRating: props.musicRating,
      overallRating: props.overallRating,
    });
  } 

  return (
    <tr id={props._id}>
      <td> {props.name} </td>
      <td> {props.year} </td>
      <td> {props.plotRating} </td>
      <td> {props.actingRating} </td>
      <td> {props.musicRating} </td>
      <td> {props.overallRating} </td>
      <td><button className="button is-danger" onClick={ e => deleteRow()}>Delete</button></td>
      <td><button className="button is-link" onClick={e => editRow()}>Edit</button></td>
    </tr>
  )
}

const EntrySection = ({ onSubmitSuccess}) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [plotRating, setPlotRating] = useState('')
  const [actingRating, setActingRating] = useState('')
  const [musicRating, setMusicRating] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
      year: parseInt(year),
      plotRating: parseInt(plotRating),
      actingRating: parseInt(actingRating),
      musicRating: parseInt(musicRating),
    };

    try {
      const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      onSubmitSuccess()

      setName('')
      setYear('')
      setPlotRating('')
      setActingRating('')
      setMusicRating('')
    }
    catch (e) {
      console.log(e)
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <p className="title" style={{marginBottom: '30px'}}>
        Create a Movie Rating Entry
      </p>
      <p className="subtitle is-5"> Submit a new movie rating using the form below. All fields must be filled.</p>
      <section>
      <form className="form-inputs" id="inputForm" onSubmit={handleSubmit}>
        <div className="form-inputs">
          <label htmlFor="name" className="has-text-weight-medium">Enter your movie title here: </label>
          <input className="input is-primary is-small" type="text" id="name" placeholder="Movie Name" required 
            value={name} onChange={e => setName(e.target.value)}/>
        </div>
        <div className="form-inputs">
          <label htmlFor="year" className="has-text-weight-medium">Enter your movie release year (1900-2025) here: </label>
          <input className="number-input input is-primary is-small" placeholder="1900" type="number" id="year" min="1900" max="2025" required
             value={year} onChange={e => setYear(e.target.value)}/>
        </div>
          <label htmlFor="plotRating" className="has-text-weight-medium">Enter your movie plot rating (0-10) here: </label>
          <input className="number-input input is-primary is-small" placeholder="10" type="number" id="plotRating" min="0" max="10" required
             value={plotRating} onChange={e => setPlotRating(e.target.value)}/>
        <div className="form-inputs">
          <label htmlFor="actingRating" className="has-text-weight-medium">Enter your movie acting rating (0-10) here: </label>
          <input className="number-input input is-primary is-small" placeholder="10" type="number" id="actingRating" min="0" max="10" required 
             value={actingRating} onChange={e => setActingRating(e.target.value)}/>
        </div>
        <div className="form-inputs">
          <label htmlFor="musicRating" className="has-text-weight-medium">Enter your movie music rating (0-10) here: </label>
          <input className="number-input input is-primary is-small" placeholder="10" type="number" id="musicRating" min="0" max="10" required
             value={musicRating} onChange={e => setMusicRating(e.target.value)}/>
        </div>
        <div className="form-submit">
          <button className="button is-primary is-small" id="form-submit" type="submit" >Submit Rating</button>
        </div>
      </form>
      </section>
      </div>
    </div>
    
  )
}

const EditSection = ({entry, onCancelEditing, onSubmitSuccess}) => {
  const [editedEntryPlot, setEditedEntryPlot] = useState(entry.plotRating)
  const [editedEntryActing, setEditedEntryActing] = useState(entry.actingRating)
  const [editedEntryMusic, setEditedEntryMusic] = useState(entry.musicRating)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      plotRating: parseInt(editedEntryPlot),
      actingRating: parseInt(editedEntryActing),
      musicRating: parseInt(editedEntryMusic),
      _id: entry._id
    };

    try {
      const response = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log(result)

      onSubmitSuccess()
    }
    catch (e) {
      console.log(e)
    }
  };

  return (
    <div className="card">
      <div className="card-content">

      <p className="title" style={{marginBottom: '30px'}}>
        Edit a Movie Entry
      </p>

      <h5 className="subtitle is-5">
        Modify your movie plot, acting, and music ratings in the table below. Not all fields must be changed.
      </h5>

      <table>
        <thead>
          <tr style={{ fontSize: '22px' }}>
            <th>Name</th>
            <th>Year</th>
            <th>Plot Rating</th>
            <th>Acting Rating</th>
            <th>Music Rating</th>
          </tr>
        </thead>
        <tbody style={{ fontSize: '18px' }}>
          <tr>
            <td id="edit-name">{entry.name}</td>
            <td id="edit-year">{entry.year}</td>
            <td id="edit-plotRating">
              <input
                style={{ width: '60px', height: '20px' }}
                type="number"
                id="edit-plot"
                min="0"
                max="10"
                required
                defaultValue={entry.plotRating} 
                onChange={e => setEditedEntryPlot(e.target.value)}
              />
            </td>
            <td id="edit-actingRating">
              <input
                style={{ width: '60px', height: '20px' }}
                type="number"
                id="edit-acting"
                min="0"
                max="10"
                required
                defaultValue={entry.actingRating} 
                onChange={e => setEditedEntryActing(e.target.value)}
              />
            </td>
            <td id="edit-musicRating">
              <input
                style={{ width: '60px', height: '20px' }}
                type="number"
                id="edit-music"
                min="0"
                max="10"
                required
                defaultValue={entry.musicRating} 
                onChange={e => setEditedEntryMusic(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '50px',
        }}
      >
        <button className="button is-primary" id="edit-submit" onClick={e => handleSubmit(e)}>
          Submit Edits
        </button>
        <button className="button is-primary" id="edit-cancel" onClick={e => onCancelEditing()}>
          Cancel editing
        </button>
      </div>
    </div>
    </div>
  )
}

const TableSection = ({onSetEditing, onSetEntering, onDelete, entries}) => {

  useEffect( ()=> {
    document.title = `${entries.length} entry(s)`
  }, [entries])

  return (
    <div className="card">
      <div className="card-content">
      <p className="title" >
        View Your Movie Ratings
      </p>
      <table>
          <thead>
              <tr style={{ fontSize: "1rem" }}>
                  <th>Name</th>
                  <th>Year</th>
                  <th>Plot Rating</th>
                  <th>Acting Rating</th>
                  <th>Music Rating</th>
                  <th>Overall Rating</th>
              </tr>
          </thead>
          <tbody id="movie-table-body">
            { entries.map( (entry,i) => <Entry key={i} name={entry.name} year={entry.year} plotRating={entry.plotRating} actingRating={entry.actingRating}
            musicRating={entry.musicRating} overallRating={entry.overallRating} _id={entry._id} onSetEditing={onSetEditing} onDelete={onDelete}></Entry> ) }
          </tbody>
      </table>
    </div>
    </div>
  )
}

const Home = ({username, isNewUser}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [entries, setEntries] = useState([ ]) 

  const fetchEntries = async () => {
    try {
      const response = await fetch('/results', { method: 'GET' });
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div>
      <section className="hero is-small is-primary" role="banner">
        <div className="hero-body">
          <p className="title"> Home Page - Create, Edit, and Delete Reviews </p>
          <p className="subtitle"> Movie Reviewer </p>
        </div>
      </section>
      <div className="main-container">
      <div className="welcome-messages">
        <p> {isNewUser ? 'New user created!' : ''} Welcome, {username}! </p>
      </div>
    </div>
    <div className='tracker-container'>
      <div className="left-boxes">
        {isEditing ? (
          <div >
            <EditSection entry={editingEntry} onCancelEditing={() => setIsEditing(false)} onSubmitSuccess={() => {setIsEditing(false); fetchEntries()}}/>
          </div>
        ) : (
          <div>
            <EntrySection onSubmitSuccess={() => {fetchEntries()}}/>
          </div>
        )}
      </div>
      <div> 
          <TableSection entries={entries}
                onSetEditing={(entry) => { setEditingEntry(entry); setIsEditing(true); console.log(isEditing)}} 
                onSetEntering={() => setIsEditing(false)}
                onDelete={() => { setIsEditing(false); fetchEntries() }}>  </TableSection>
      </div>
    </div>
    </div>
  );
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  return (
    <div className="App">
      <div>
      {isAuthenticated ? (
        <Home username={username} isNewUser={isNewUser}/>
      ) : (
        <Login onLoginSuccess={() => {setIsAuthenticated(true)}} 
               setUsername={(username) => setUsername(username)} 
               onIsNewUser={() => setIsNewUser(true)} />
      )}
      </div>
    </div>
  );

}

export default App