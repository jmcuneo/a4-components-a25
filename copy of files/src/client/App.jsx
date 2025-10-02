import React from 'react';

// we could place this Todo component in a separate file, but it's
// small enough to alternatively just include it in our App.js file.

class Entry extends React.Component {
  // our .render() method creates a block of HTML using the .jsx format
  render() {
    return <tr>
            <td>{this.props.ranking+1}</td>
            <td>{this.props.username}</td>
            <td>{this.props.score}</td>
            <td>{this.props.grade}</td>
            <td>{this.props.combo}</td>
            <td>{this.props.complete}</td>
          </tr>
  }
}

class FormPanel extends React.Component {
  constructor( props ){
    super( props )
    this.state = {loggedIn: false,
      servingUsername: "",
      servingPassword: ""
    }
  }

  render() {
    return <div className="border border-4 border-danger bg-light p-3">
            {this.state.loggedIn ? (
              <>
                <h2 style={{fontFamily: 'Knewave'}}>Create or Edit Entry</h2>
                <p>Welcome! A new account will be created for you once you submit a score.
                Use the same username and password to log in again later.
                <br/>
                When logged in, you can edit your data and resubmit to change it.
                You can also delete your score by pressing the delete button.</p>
                <form id="entryForm">
                  <label htmlFor="score">Score</label>
                  <input type="number" id="score" min="0" max="1000000"/>
                  <br/>
                  <label htmlFor="combo">Max Combo</label>
                  <input type="number" id="combo" min="0" max="1000"/>
                  <br/>
                  <br/>
                  <p>Completion Status</p>
                  <input type="radio" id="am" name="completion" value="All Marvelous"/>
                  <label htmlFor="am">All Marvelous</label>
                  <br/>
                  <input type="radio" id="fc" name="completion" value="Full Combo"/>
                  <label htmlFor="fc">Full Combo</label>
                  <br/>
                  <input type="radio" id="ml" name="completion" value="Missless"/>
                  <label htmlFor="ml"><abbr title="This is the semantic used for 5 or fewer misses. Nobody is sure why this was selected.">Missless</abbr></label>
                  <br/>
                  <input type="radio" id="cl" name="completion" value="Clear"/>
                  <label htmlFor="cl">Clear</label>
                  <br/>
                  <input type="radio" id="nc" name="completion" value="Not Clear"/>
                  <label htmlFor="nc">Not Clear</label>
                  <br/><br/>
                  <button id="entrybutton" onClick={(e) => this.submitEntry(e)}>Submit</button>
                  <button id="deletebutton" onClick={(e) => this.deleteEntry(e)}>Delete</button>
                </form>
              </>
            ) : (
              <>
                <h3 style={{fontFamily: 'Knewave'}}>Log In or Create Account</h3>
                <p>Type in a username and password into the boxes below before making changes to the leaderboard.<br />
                  If you do not have an account, a new one will be made for you.
                </p>

                <form id="loginForm">
                  <label htmlFor="lusername">Username</label>
                  <input type="text" id="lusername" />
                  <br/>
                  <br/>
                  <label htmlFor="lpassword">Password</label>
                  <input type="password" id="lpassword"/>
                  <br/>
                  <br/>
                  <button id="loginbutton" onClick={(e) => this.logIn(e)}>Log In</button>
                </form>
              </>
            )}
          </div>
  }

  async logIn(event) {
    let username = document.querySelector( '#lusername' ).value
    let password = document.querySelector( '#lpassword' ).value

    event.preventDefault();
    await fetch( '/login', {
      method:'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => 
      {return response.json()}
    ).then(
      result => {
        this.setState({loggedIn: true,
          servingUsername: username,
          servingPassword: password
        }, () => {
      this.render()})
      }
    )
  }

  submitEntry(event) {
    let score = document.querySelector( '#score' ).value
    let combo = document.querySelector( '#combo' ).value
    let complete = document.querySelector('#entryForm').elements["completion"].value
    event.preventDefault();
    fetch( '/entry', {
      method:'POST',
      body: JSON.stringify({ username: this.state.servingUsername, password: this.state.servingPassword, score, combo, complete}),
      headers: { 'Content-Type': 'application/json' }
    }).then(() =>
    {
      this.props.onSignal()
    }
    )
  }

  deleteEntry(event) {
    event.preventDefault();
    fetch( '/delete', {
      method:'POST',
      body: JSON.stringify({ username: this.state.servingUsername, password: this.state.servingPassword}),
      headers: {'Content-Type': 'application/json'}
    }).then(() => {
      this.props.onSignal()
    }
    )
  }

}

// main component
class App extends React.Component {
  constructor( props ) {
    super( props )
    // initialize our state
    this.state = { leaderboard:[]}
    this.load = this.load.bind(this)
    this.load()
  }

  // load in our data from the server
  load() {
    fetch( '/load', { method:'get'})
      .then( response => response.json())
      .then( async json =>  {
        this.setState({ leaderboard:json }) 
      })
  }

  // render component HTML using JSX 
  render() {
    return (
      <div className="App">
        <div className="container" style={{fontFamily: 'Lexend'}}>
          <div className="text-center mt-3">
            <h1 style={{fontFamily: 'Knewave'}}>Leaderboard Tracker for</h1><img style={{width: "20%"}} src="logo.png" alt="WACCA" /><br/><br/>
            <p style={{width: "60%", position:"relative", left: "20%"}} id="desc">
              WACCA is an arcade rhythm game that encourages competition to see which players can
              attain the highest scores. This website allows users to enter, edit, or delete their scores
              from a leaderboard.
              <br/><br/>
              This particular example would be for a level with a maximum combo of 1000.
            </p>
          </div>
          <div className="row border-top border-4 border-warning">
            <div className="col p-2 bg-primary" id="formBox">
              <FormPanel onSignal={this.load}/>
            </div>
            <div className="col-8" style={{height: "800px"}}>
              <div className="p-3 w-100 text-center bg-secondary-subtle border border-4 border-secondary">
                <h3 style={{fontFamily: 'Knewave'}}>Leaderboard</h3>
                <table className="w-100" id="leaderboard">
                  <thead><tr id="lbhead">
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Combo</th>
                    <th>Complete</th>
                  </tr></thead>
                  <tbody>
                  {this.state.leaderboard.map( (entry,i) => <Entry key={i} ranking={i} username={entry.username} score={entry.score} grade={entry.grade} combo={entry.combo} complete={entry.complete} /> )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>      
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossOrigin="anonymous"></script>
      </div>
    )
  }
}

export default App;