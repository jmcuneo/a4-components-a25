<script>
  let movieName = $state()
  let releaseYear = $state()
  let numStars = $state()
  let review = $state()
  let tbody = $state()

  const showMe = function(){
    const response = fetch( "/showMe", {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(response) {return response.json();})
    .then(createTable)
  }

  const submit = async function( event ) {
    event.preventDefault()
    const json = {"movieName": movieName, "releaseYear": releaseYear, "numStars": numStars, "review": review, "ranking": 1},
          body = JSON.stringify( json )
    const response = await fetch( "/submit", {
      method:"POST",
      headers: {'Content-Type': 'application/json'},
      body 
    }).then(function(response) {return response.json();})
    .then(createTable)
  }

  const remove = async function( event ) {
    event.preventDefault()
    const json = {"movieName": movieName, "releaseYear": releaseYear},
          body = JSON.stringify( json )
    const response = await fetch( "/delete", {
      method:"POST",
      headers: {'Content-Type': 'application/json'},
      body 
    }).then(function(response) {return response.json();})
    .then(createTable)
  }

  window.onload = function() {
    showMe();
  }


const createTable = function (json){
  tbody = ""
  let temp = "<tbody>"
  const star = "&#9733;";
  const noStar = "&#9734";
  //for each json item, put all the objects in their own cell
  json.forEach( item => {
    let row = "<tr><td>";
    row = row.concat(item.movieName, "</td><td>")
    row = row.concat(item.releaseYear, "</td><td>")
    let starPics = "";
    for (let i = 0; i < item.numStars; i++){
        starPics = starPics + star;
    }
    for (let j = 0; j < (10 - item.numStars); j++){
        starPics = starPics + noStar;
    }
    row = row.concat(starPics, "</td><td>")
    row = row.concat(item.review, "</td><td>")
    row = row.concat(item.ranking, "</td></tr>")
    temp = temp.concat(row)
  })
  temp = temp.concat("</tbody>")
  tbody = tbody.concat(temp)
  document.querySelector('form').reset()
}
</script>

<main>
  <h2 id="bodyTitle">Add or Edit Entry</h2>
  <p style = "font-size: 15px;">To edit your rating or review of an existing entry, make sure to use the 
    same movie title and release year, then hit submit. To delete an entry, make sure to use the same movie
    title and release year, then hit delete.</p>
  <form id="myForm">
    <label for="movieName">Movie Title:</label><br>
    <input bind:value={movieName} type="text" id="movieName" required><br>
    
    <label for="releaseYear">Release Year:</label><br>
    <input bind:value={releaseYear} type="number" id="releaseYear" min="1800" max="2025" required><br>

    <label for="starRating">Number of Stars (0 - 10):</label><br>
    <input bind:value={numStars} type="number" id="starRating" min="0" max="10" required><br>

    <label for="review">Movie Review:</label><br>
    <textarea bind:value={review} id="review"></textarea><br><br>

    <input type="submit" id="submitEntry" value="submit" onclick={submit}>
    <input type="submit" id="deleteButton" value="delete" onclick={remove}>
  </form>
  <br><br>
  <table id="displayData">
    <thead id="myRow">
      <tr>
      <th>Movie Name</th>
      <th>Release Date</th>
      <th>Rating</th>
      <th>Review</th>
      <th>Ranking</th>
      </tr>
    </thead>
    {@html tbody}
  </table>
</main>
