import React from "react";

class App extends React.Component {
  constructor( props ) {
    super( props )
    this.state = { 
      tasks: [],
      newTask: {
        task: '',
        assignee: {
          president: false,
          vicepresident: false,
          treasurer: false,
          secretary: false
        }
      }
    }
    this.load()
  }

  load() {
    fetch( '/data', { method:'get', 'no-cors':true })
      .then( response => response.json() )
      .then( json => {
         this.setState({ tasks:json }) 
      })
  }

  async updateTaskCompletion(task, complete) {
    const response = await fetch('/update', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task: task, complete: complete })
    });
    if (response.ok) {
      this.load();
    }
  }

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'task') {
      this.setState(prevState => ({
        newTask: {
          ...prevState.newTask,
          task: value
        }
      }));
    } else if (type === 'checkbox') {
      this.setState(prevState => ({
        newTask: {
          ...prevState.newTask,
          assignee: {
            ...prevState.newTask.assignee,
            [name]: checked
          }
        }
      }));
    }
  }

  add = async (e) => {
    e.preventDefault();
    
    const taskData = {
      assignee: this.state.newTask.assignee,
      task: this.state.newTask.task,
      complete: false,
      partnerTask: false
    };

    const response = await fetch('/submit', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });

    if (response.ok) {
      this.setState({
        newTask: {
          task: '',
          assignee: {
            president: false,
            vicepresident: false,
            treasurer: false,
            secretary: false
          }
        }
      });
      this.load();
    }
  }

  renderTasksByRole(role) {
    return this.state.tasks
      .filter(task => task.assignee[role])
      .map((task, idx) => (
        <div key={idx} className="card mb-2">
          <div className="card-body p-2">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={task.complete}
                  onChange={(e) => this.updateTaskCompletion(task.task, e.target.checked)}
                />
                <span className={task.complete ? "text-decoration-line-through text-muted" : ""}>
                  {task.task}
                </span>
              </div>
            </div>
          </div>
        </div>
      ));
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
          <div className="container">
            <a className="navbar-brand fw-bold" href="#">
              <i className="fas fa-tasks me-2"></i>Team To-Do List
            </a>
            <div className="navbar-nav ms-auto d-flex align-items-center">
              <span id="welcomeMessage" className="navbar-text me-3"></span>
            </div>
          </div>
        </nav>

        <div className="createTask">
            <div className="col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                    <div className="card-header bg-success text-white">
                        <h4 className="mb-0"><i className="fas fa-plus-circle me-2"></i>Create New Task</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={this.add}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Task</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              name="task"
                              value={this.state.newTask.task}
                              onChange={this.handleInputChange}
                              placeholder="Enter task description..." 
                              required 
                            /> 
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label fw-bold">Assign to Officer(s)</label>
                            <div className="row g-2">
                            <div className="col-6">
                                <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  name="president"
                                  checked={this.state.newTask.assignee.president}
                                  onChange={this.handleInputChange}
                                />
                                <label className="form-check-label">
                                    <i className="fas fa-crown text-warning me-1"></i>President
                                </label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  name="vicepresident"
                                  checked={this.state.newTask.assignee.vicepresident}
                                  onChange={this.handleInputChange}
                                />
                                <label className="form-check-label">
                                    <i className="fas fa-user-tie text-info me-1"></i>Vice President
                                </label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  name="treasurer"
                                  checked={this.state.newTask.assignee.treasurer}
                                  onChange={this.handleInputChange}
                                />
                                <label className="form-check-label">
                                    <i className="fas fa-dollar-sign text-success me-1"></i>Treasurer
                                </label>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  name="secretary"
                                  checked={this.state.newTask.assignee.secretary}
                                  onChange={this.handleInputChange}
                                />
                                <label className="form-check-label">
                                    <i className="fas fa-clipboard text-primary me-1"></i>Secretary
                                </label>
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-success btn-lg w-100">
                            <i className="fas fa-plus me-2"></i>Create Task
                        </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

            <div className="col-lg-8">
        <div className="row">
        <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
            <div className="card-header bg-warning text-dark">
                <h5 className="mb-0"><i className="fas fa-crown me-2"></i>President Tasks</h5>
            </div>
            <div className="card-body">
                {this.renderTasksByRole('president')}
            </div>
            </div>
        </div>

        <div className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
            <div className="card-header bg-info text-white">
                <h5 className="mb-0"><i className="fas fa-user-tie me-2"></i>Vice President Tasks</h5>
            </div>
            <div className="card-body">
                {this.renderTasksByRole('vicepresident')}
            </div>
            </div>
        </div>

        <div className="col-md-6 mb-4">
                <div className="card shadow-sm h-100">
                <div className="card-header bg-success text-white">
                    <h5 className="mb-0"><i className="fas fa-dollar-sign me-2"></i>Treasurer Tasks</h5>
                </div>
                <div className="card-body">
                    {this.renderTasksByRole('treasurer')}
                </div>
                </div>
            </div>

            <div className="col-md-6 mb-4">
                <div className="card shadow-sm h-100">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0"><i className="fas fa-clipboard me-2"></i>Secretary Tasks</h5>
                </div>
                <div className="card-body">
                    {this.renderTasksByRole('secretary')}
                </div>
                </div>
            </div>
            </div>
        </div>

      </div>
    );
  }
}

export default App;
