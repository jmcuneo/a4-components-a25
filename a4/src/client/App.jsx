import React, { useState, useEffect } from 'react'

function Table({runTable}){
  const [fields, setFields] = useState([])
  const [data, setData] = useState({})

  async function getData(){
    const response = await fetch('/table', {
        method: 'GET'
    })
    const appdata = await response.json()
    const getFields = await fetch('/fields', {
        method: 'GET'
    })

    const fields = await getFields.json()
    setFields(fields.filter(password => password != 'password'))
    setData(appdata)
  }

  useEffect(() => {
    getData()
  }, {runTable})

}

return(
  <table class = "pure-table">
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
          <th key = {field}>{data[field]}</th>
        ))}
      </tr>
    </tbody>
  </table>
)

export default App
