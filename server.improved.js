const http = require("http"),
    fs = require("fs"),
    path = require("path"),
    mime = require("mime"),
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
    if(request.url === "/stats") {
        response.writeHead(200, "OK", {"Content-Type": "application/json"});
        response.end(JSON.stringify(appdata));
        return;
    }

    let filePath = path.join(__dirname, 'dist', request.url === '/' ? 'index.html' : request.url);

    fs.readFile(filePath, function (err, content) {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'dist', 'index.html'), function(err, content) {
                    if (err) {
                        response.writeHead(500);
                        response.end('Error loading application');
                    } else {
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        response.end(content);
                    }
                });
            } else {
                response.writeHead(500);
                response.end('Server Error: ' + err.code);
            }
        } else {
            const type = mime.getType(filePath);
            response.writeHead(200, {'Content-Type': type});
            response.end(content);
        }
    });
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

console.log("Server running at port " + port)
server.listen(process.env.PORT || port)