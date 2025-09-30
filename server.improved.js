const http = require("http"),
    fs = require("fs"),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you"re testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require("mime"),
    dir = "public/",
    port = 3000

let appdata = [];

const server = http.createServer(function (request, response) {
    if (request.method === "GET") {
        handleGet(request, response)
    } else if (request.method === "POST") {
        handlePost(request, response)
    } else if (request.method === "DELETE") {
        handleDelete(request, response);
    }
})

const handleDelete = function (request, response) {
    if(request.url === "/*") {
        appdata = [];
        response.writeHead(200, "OK", {"Content-Type": "application/json"});
        response.end(JSON.stringify(appdata));
    } else {
        response.writeHead(404, "Not Found", {"Content-Type": "application/json"});
        response.end(JSON.stringify({error: "Not Found"}));
    }
}

const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1)

    if (request.url === "/") {
        sendFile(response, "public/index.html")
    } else if(request.url === "/stats") {
        response.writeHead(200, "OK", {"Content-Type": "application/json"});
        response.end(JSON.stringify(appdata));
    } else {
        sendFile(response, filename)
    }
}

const handlePost = function (request, response) {
    if(request.url === "/guess") {
        let dataString = ""

        request.on("data", function (data) {
            dataString += data
        })

        request.on("end", function () {

            let guess = JSON.parse(dataString);
            appdata[guess.gameId].guesses.push(guess.guess)
            appdata[guess.gameId].won = appdata[guess.gameId].answer === guess.guess;

            console.log(appdata);

            response.writeHead(200, "OK", {"Content-Type": "application/json"});
            response.end(appdata[guess.gameId].won ? "correct" : "incorrect");
        })
    } else if(request.url === "/game") {
        let dataString = ""

        request.on("data", function (data) {
          dataString += data
        })

        request.on("end", function () {

            appdata.push(JSON.parse(dataString))

            response.writeHead(200, "OK", {"Content-Type": "application/json"})
            response.end("test")
        })
    }
}

const sendFile = function (response, filename) {
    const type = mime.getType(filename)

    fs.readFile(filename, function (err, content) {

        // if the error = null, then we"ve loaded the file successfully
        if (err === null) {

            // status code: https://httpstatuses.com
            response.writeHeader(200, {"Content-Type": type})
            response.end(content)

        } else {

            // file not found, error code 404
            response.writeHeader(404)
            response.end("404 Error: File Not Found")

        }
    })
}

server.listen(process.env.PORT || port)
