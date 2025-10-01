import React from "react";
import ReactDOM from "react-dom/client";


const submit = async function(event){
    event.preventDefault();

    const inputTitle = document.querySelector("#title").value,
        inputThoughts = document.querySelector("#thoughts").value,
        inputRate = rating,
        inputDate = document.querySelector("#date").value,
        json = { title: inputTitle, thoughts: inputThoughts, date: inputDate, rating: inputRate};
        body = JSON.stringify(json);
    
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0];

    clearInput();

    const response = await fetch("/submit", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body
    });

    const data = await response.json();
}

const login = async function(event){
    //alert("I don't want you to log in right now");
    event.preventDefault();

    const user = document.querySelector("#username").value,
        pass = document.querySelector("#password").value,
        json = { username: user, password: pass};
        body = JSON.stringify(json);

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body
    });

    const data = await response.json();
    const message = document.querySelector("#loginMessage");
    message.textContent = data.message;

    if(data.status == "tryAgain" || data.status == "newUser"){
        const user = document.getElementById("username");
        user.value = "";
        const pass = document.getElementById("password");
        pass.value = "";

        

    }

    if (data.success == true){
        //alert("Login successful.");
        //window.location.href = "main.html";
        window.location.replace("main.html");
    }
}

const deleteFilm = async function(title, event){
    //event.preventDefault();
    const json = { title: title},
        body = JSON.stringify(json);

    const response = await fetch("/delete", {
        method: "DELETE",
        headers: {
            "Content-type": "application/json"
        },
        body
    });

    const result = await response.json();

    await displayFilms();
}

const view = async function (event){
    event.preventDefault();
    
    window.location.href = "logs.html";
    
}

const displayFilms = async function(event){
    //event.preventDefault();
    const response = await fetch("/data", {
        method: "GET",
    })

    const data = await response.json();

    const filmTable = document.getElementById("films");
    filmTable.innerHTML = "";

    var tempTable = document.createElement("table");
    
    let content = "";
    content += "<tr class = 'firstRow'><th>Film</th><th>Thoughts</th><th>Rating</th><th>Date Watched</th><th>Number of Days Since Seen</th>";
    
    for (var i = 0; i < data.length; i++){
        content += "<tr>";
        content += "<td>" + data[i].title + "</td>";
        content += "<td>" + data[i].thoughts + "</td>";
        content += "<td>" + data[i].rating + "/5 </td>";
        content += "<td>" + data[i].date + "</td>";
        content += "<td>";

        let today = new Date();
    
        let watchedDate = new Date(data[i].date);
        let diffMs = today - watchedDate;
        let diffDays = Math.floor(diffMs / (1000 * 60 * 60 *24));

        content += diffDays + "<td>";
        content += `<button class="btn" onclick="deleteFilm('${data[i].title.replace(/'/g, "\\'")}')">Delete</button>`;

        content += "</tr>";

    }

    tempTable.innerHTML = content;
    document.getElementById("films").append(tempTable);
}

const change = async function(event){
    event.preventDefault();

    const inputTitle = document.querySelector("#changeTitle").value,
        inputRate = rating,
        json = { changeTitle: inputTitle, changeRating: inputRate};
        body = JSON.stringify(json);

    const response = await fetch("/change", {
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body
    });

    displayFilms();
 
}

const back = async function(event){
    window.location.href = "main.html";
}


window.onload = function(){

    const filmsTable = document.querySelector("#films");
    if (filmsTable){
        displayFilms();
    }

    //For index
    const submitButton = document.querySelector("#submit");
    if (submitButton) {
        submitButton.onclick = submit;
    }

    //For login
    const loginButton = document.querySelector("#login");
    if (loginButton) {
        loginButton.onclick = login;
    }

    const viewButton = document.querySelector("#view");
    if (viewButton){
        viewButton.onclick = view;
    }

    const changeButton = document.querySelector("#change");
    if (changeButton){
        changeButton.addEventListener("click", change);
    }

    const backButton = document.querySelector("#back");
    if (backButton){
        //backButton.addEventListener("click", window.location.href = "logs.html") ;
        backButton.onclick = back;
    }
}

//var rating = 0;
const [rating, setRating] = useState(0);

function rate(n){
    //rating = n;
    setRating(n);
}


function clearInput(){
    //alert("Cleared");
    const titleEnter = document.getElementById("title");
    titleEnter.value = "";
    const thoughtsEnter = document.getElementById("thoughts");
    thoughtsEnter.value = "";
    const ratings = document.querySelectorAll('input[name="rating"]');
    ratings.forEach(r => r.checked = false);
    rating = 0;
}



