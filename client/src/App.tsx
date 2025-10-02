import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

interface MileageRecord {
  date: string;
  cost: number;
  gallons: number;
  totalMileage: number;
  cpg: number;
}

interface User {
  username: string;
  displayName?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mileageData, setMileageData] = useState<MileageRecord[]>([]);
  const [editingIndex, setEditingIndex] = useState(-1);

  // Set today's date as default
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cost: '',
    gallons: '',
    totalMileage: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadMileageData();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user', {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMileageData = async () => {
    try {
      const response = await fetch('/api/mileage', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMileageData(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord = {
      date: formData.date,
      cost: parseFloat(formData.cost),
      gallons: parseFloat(formData.gallons),
      totalMileage: parseInt(formData.totalMileage),
      cpg: parseFloat((parseFloat(formData.cost) / parseFloat(formData.gallons)).toFixed(2))
    };

    let newData;
    if (editingIndex >= 0) {
      // Update existing record
      newData = [...mileageData];
      newData[editingIndex] = newRecord;
      setEditingIndex(-1);
    } else {
      // Add new record
      newData = [...mileageData, newRecord];
    }

    try {
      await fetch('/api/mileage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newData)
      });

      setMileageData(newData);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        cost: '',
        gallons: '',
        totalMileage: ''
      });
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  const editRecord = (index: number) => {
    const record = mileageData[index];
    setFormData({
      date: record.date,
      cost: record.cost.toString(),
      gallons: record.gallons.toString(),
      totalMileage: record.totalMileage.toString()
    });
    setEditingIndex(index);
  };

  const deleteRecord = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const newData = mileageData.filter((_: MileageRecord, i: number) => i !== index);

      try {
        await fetch('/api/mileage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(newData)
        });

        setMileageData(newData);
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record');
      }
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setMileageData([]);
    } catch (error) {
      console.error('Error logging out:', error);
      setUser(null);
      setMileageData([]);
    }
  };

  const login = () => {
    window.location.href = '/auth/github';
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="bg-light vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-primary text-white text-center">
                  <h1>Mileage Tracker</h1>
                </div>
                <div className="card-body text-center">
                  <button className="btn btn-dark btn-lg" onClick={login}>
                    Login with GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <h1 className="navbar-brand">Mileage Tracker</h1>
          <button className="btn btn-light" onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="container mt-4">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h2>Add Mileage Record</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date of fuel purchase</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cost" className="form-label">Cost ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      id="cost" 
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gallons" className="form-label">Gallons</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      id="gallons" 
                      value={formData.gallons}
                      onChange={(e) => setFormData({...formData, gallons: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="totalMileage" className="form-label">Total Mileage</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="totalMileage" 
                      value={formData.totalMileage}
                      onChange={(e) => setFormData({...formData, totalMileage: e.target.value})}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    {editingIndex >= 0 ? 'Update Record' : 'Add Record'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-dark text-white">
                <h2>Your Mileage Records</h2>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Cost</th>
                      <th scope="col">Gallons</th>
                      <th scope="col">Total Mileage</th>
                      <th scope="col">Cost per Gallon</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mileageData.map((record, index) => (
                      <tr key={index}>
                        <td>{record.date}</td>
                        <td>${record.cost.toFixed(2)}</td>
                        <td>{record.gallons.toFixed(2)}</td>
                        <td>{record.totalMileage}</td>
                        <td>${record.cpg}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-warning me-2" 
                            onClick={() => editRecord(index)}
                            style={{marginRight: '8px'}}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => deleteRecord(index)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
