import React, { useState, useEffect } from 'react'

import './styles.css'

function Table({runTable}){
  const [fields, setFields] = useState([])
  const [data, setData] = useState({})

  async function getData(){
   const response = await fetch('/table', { method: 'GET' });
    const appdata = await response.json()
    const getFields = await fetch('/fields', { method: 'GET' });


    const fields = await getFields.json()
    setFields(fields.filter(password => password != 'password'))
    setData(appdata)
  }

  useEffect(() => {
    getData()
  }, [runTable])

return(
  <table className = "pure-table">
    <thead>
      <tr>
        {fields.map((field => 
          <th key = {field}>{field}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {fields.map((field => 
          <td key = {field}>{data[field]}</td>
        ))}
      </tr>
    </tbody>
  </table>
)
}

function DataTable(){
  const[runTable, setRunTable] = useState(0);

  async function add(event){
    event.preventDefault();
    
        const field = event.target.field.value,
              toAdd = event.target.toAdd.value,
              json = {field, toAdd},
              body = JSON.stringify(json)

        const response = await fetch("/add", {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body
        })

        setRunTable(x => x + 1)
        event.target.reset();
  }

  async function update(event){
    event.preventDefault()  

        const field = event.target.field.value,
              toUpdate = event.target.toUpdate.value,
              json = {field, toUpdate},
              body = JSON.stringify(json)

        const response = await fetch("/update", {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body
        })

        const results = await response.json();

        if(!results.success){
            alert("Please enter a valid field!");
        }

        setRunTable(x => x + 1)
        event.target.reset();
  }

  async function remove(event){
    event.preventDefault()  

        const field = event.target.field.value,
              json = {field},
              body = JSON.stringify(json)

        const response = await fetch("/remove", {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body
        })

        const results = await response.json();

        if(!results.success){
            alert("Please enter a valid field!");
        }

        setRunTable(x => x + 1);
        event.target.reset();
  }

  return(
    <div>
      <h1>All Available Data</h1>
      <Table runTable={runTable} />
      <div id = "allForms">
        <div id = "addForm">
          <h2>Add Info To Your Account</h2>
          <form onSubmit = {add} className = "pure-form">
            <label htmlFor="field">Field</label> <br></br>
            <input type = "text" name = "field" id = "field"/> <br></br><br></br>
            <label htmlFor="toAdd">Value</label> <br></br>
            <input type = "text" name = "toAdd" id = "toAdd"/> <br></br><br></br>
            <input type = "submit" value = "submit" className = "pure-button pure-button-active"/> <br></br>
          </form>   
        </div>
        <div id = "updateForm">
          <h2>Update Info To Your Account</h2>
          <form onSubmit = {update} className = "pure-form">  
            <label htmlFor="field">Field</label> <br></br>
            <input type = "text" name = "field" id = "field"/> <br></br><br></br>
            <label htmlFor="toUpdate">Value</label> <br></br>
            <input type = "text" name = "toUpdate" id = "toUpdate"/> <br></br><br></br>
            <input type = "submit" value = "submit" className = "pure-button pure-button-active"/> <br></br>
          </form>
      </div>
        <div id = "removeForm">
        <h2>Remove Info From Your Account</h2>
        <form onSubmit = {remove} className = "pure-form">
          <label htmlFor="field">Field</label> <br></br>
          <input type = "text" name = "field" id = "field"/> <br></br><br></br>
          <input type = "submit" value = "submit" className = "pure-button pure-button-active"/> <br></br>
      </form>
    </div>
      </div>
    </div>
  )
}

export default DataTable;

