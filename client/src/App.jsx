import { useState } from 'react'
import './App.css'

function App() {
  const [cars, setCars] = useState([]);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mpg, setMPG] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const body = JSON.stringify({
      model,
      year: Number(year),
      mpg: Number(mpg),
    });

    const response = await fetch("/submit", {
      method: "POST",
      body,
      headers: {"Content-Type": "application/json"},
    });

    const result = await response.json();
    setCars(result);

    setModel("");
    setYear("");
    setMPG("");
  }

  const loadData = async () => {
    const response = await fetch("/data", {
      method: "GET"
    });

    const result = await response.json();
    setCars(result);
  }

  const editRow = async (index) => {
    const newModel = prompt("Enter new model:");
    const newYear = prompt("Enter new year:");
    const newMPG = prompt("Enter new MPG:");

    const updatedEntry = {
      model: newModel,
      year: Number(newYear),
      mpg: Number(newMPG),
    };

    const response = await fetch("/modify", {
      method: "POST",
      body: JSON.stringify({index, updatedEntry}),
      headers: {"Content-Type": "application/json"},
    });

    const result = await response.json();
    setCars(result);
  }

  const deleteRow = async (index) => {
    const confirm = window.confirm("Confirm you want to delete this row");
    if(!confirm){
      return;
    }

    const response = await fetch("/delete", {
      method: "POST",
      body: JSON.stringify({index}),
      headers: {"Content-Type": "application/json"},
    });

    if(!response.ok){
      const error = await response.text();
      alert("Delete no work " + error);
      return;
    }

    const result = await response.json();
    setCars(result);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Car Data Form</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="number"
          placeholder="MPG"
          value={mpg}
          onChange={(e) => setMPG(e.target.value)}
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={loadData}>
          View Data
        </button>
      </form>

      <table border="1" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Model</th>
            <th>Year</th>
            <th>MPG</th>
            <th>Derived Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((row, index) => (
            <tr key={index}>
              <td>{row.model}</td>
              <td>{row.year}</td>
              <td>{row.mpg}</td>
              <td>${row.derivedPrice}</td>
              <td>
                <button onClick={() => editRow(index)}>Edit</button>
                <button onClick={() => deleteRow(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
