// FRONT-END (CLIENT) JAVASCRIPT HERE

let i = 0;
let hidden = true;

const submit = async function () {
    event.preventDefault()

    const input = document.querySelector("#guess"),
        json = {
            gameId: i,
            guess: parseInt(input.value)
        },
        body = JSON.stringify(json)

    const response = await fetch("/guess", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    });

    const output = await response.text();

    if(output === "correct") {
        i++;
        initialize();
    }
}

const initGame = async function () {
    const json =
        {
            gameId: i,
            answer: Math.floor(Math.random() * 10) + 1,
            guesses: [],
            won: false
        },
        body = JSON.stringify(json);

    await fetch("/game", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body
    });
}

const initialize = function () {
    initGame()
        .then(() => {
            displayGames()
                .then(() => {
                    console.log("game displayed")
                })
                .catch(err => {
                    console.log(err);
                })
            console.log("game started");
        })
        .catch(err => {
            console.log(err);
        });

}

const displayGames = async function () {
    let statElements = document.querySelectorAll(".stat");
    statElements.forEach(stat => stat.remove())

    console.log(document.getElementsByClassName("stat").length)

    const response = await fetch("/stats", {
        method: "GET"
    })

    let stats = await response.text();
    const statsList = JSON.parse(stats);

    let container = document.createElement("div");
    container.classList.add("stat");
    container.classList.add(hidden ? "hidden" : "visible");

    let table = document.createElement("table");
    table.style.width = "100%";

    let headerRow = document.createElement("tr");
    ["gameId", "answer", "guesses", "won"].forEach(header => {
        let th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    statsList.map(stat => {
        let dataRow = document.createElement("tr");
        
        let gameIdCell = document.createElement("td");
        gameIdCell.textContent = stat.gameId;
        dataRow.appendChild(gameIdCell);
        
        let answerCell = document.createElement("td");
        answerCell.textContent = stat.answer;
        dataRow.appendChild(answerCell);
        
        let guessesCell = document.createElement("td");
        guessesCell.textContent = Array.isArray(stat.guesses) ? stat.guesses.join(", ") : (stat.guesses || "");
        dataRow.appendChild(guessesCell);
        
        let wonCell = document.createElement("td");
        wonCell.textContent = stat.won.toString();
        dataRow.appendChild(wonCell);

        table.appendChild(dataRow);
    })

    container.appendChild(table);

    document.querySelector(".statistics").appendChild(container);
}

window.onload = function () {
    initialize();

    const submitButton = document.getElementById("submit");
    submitButton.onclick = () => {
        event.preventDefault()

        submit()
            .then(() => {
                displayGames()
            })
            .catch(err => {
                console.log(err);
            })
    };

    const newGameButton = document.getElementById("new-game");
    newGameButton.onclick = () => {
        event.preventDefault()
        i++;
        initialize()
    }

    const showButton = document.getElementById("view-statistics")
    showButton.onclick = () => {
        event.preventDefault();

        document.querySelectorAll(".hidden, .visible").forEach(stat => {
            stat.classList.toggle("hidden");
            stat.classList.toggle("visible");
        });

        hidden = !hidden;
    }
}

const clearAppData = async function () {
    await fetch("/*", {
        method: "DELETE"
    })
}

window.addEventListener('beforeunload', function () {
    console.log("clearing appdata");

    clearAppData()
        .then(() => {
            console.log("appdata cleared");
        }).catch(err => {
        console.log(err);
    });
})