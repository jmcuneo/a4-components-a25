// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  //going with the car example i guess
  const model = document.querySelector( "#model" ).value
  const year = parseInt(document.querySelector( "#year" ).value)
  const mpg = parseInt(document.querySelector( "#mpg" ).value)

  const body = JSON.stringify({ model, year, mpg})

  // const input = document.querySelector( "#yourname" ),
  //       json = { yourname: input.value },
  //       body = JSON.stringify( json )

  const response = await fetch( "/submit", {
    method:"POST",
    body 
  })

  const table = await response.json()
  displayData(table)

  document.querySelector("#model").value = ""
  document.querySelector("#year").value = ""
  document.querySelector("#mpg").value = ""

  console.log( "text:", table )
}

const loadData = async function( event ){
  event.preventDefault()
  const response = await fetch("/data", {method:"GET"})
  const data = await response.json()
  displayData(data)
}

const editRow = async function(index, event) {
  event.preventDefault()

  const newModel = prompt("Enter new model:")
  const newYear = prompt("Enter new year:")
  const newMPG = prompt("Enter new MPG:")
  
  const updatedEntry = {model: newModel, year: Number(newYear), mpg: Number(newMPG)}

  const response = await fetch("/modify", {
    method:"POST",
    body: JSON.stringify({index, updatedEntry})
  })

  const data = await response.json()
  displayData(data)
}

const deleteRow = async function(index, event) {
  event.preventDefault()

  const confirmDelete = confirm("Are you sure you want to delete this row?")
  if(!confirmDelete){
    return
  }

  const response = await fetch("/delete", {
    method:"POST",
    body: JSON.stringify({index})
  })

  if(!response.ok){
    const error = await response.text()
    alert("Delete didn't work:" + error)
    return
  }

  const data = await response.json()
  displayData(data)
}

function displayData(data){
  const table = document.querySelector( "#dataTable" )
  table.innerHTML = "<tr><th>Model</th><th>Year</th><th>MPG</th><th>Derived Price</th><th>Buttons</th></tr>"

  data.forEach((row, index) => {
    table.innerHTML += `<tr>
    <td>${row.model}</td>
    <td>${row.year}</td>
    <td>${row.mpg}</td>
    <td>$${row.derivedPrice}</td>
    <td>
    <button onclick="editRow(${index}, event)">Edit Row ${index}</button>
    <button onclick="deleteRow(${index}, event)">Delete Row ${index}</button>
    </td>
    </tr>`
  })
}

window.onload = function() {
   const button = document.querySelector("#submit");
  button.onclick = submit;

  const viewData = document.querySelector("#viewData");
  viewData.onclick = loadData;
}