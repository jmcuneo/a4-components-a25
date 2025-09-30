import express from "express";
import bodyParser from "body-parser";
import ViteExpress from "vite-express";

const app = express();

const messages = [
    { message: "Hello world!", from: "Server", fromStyle: '#000', sentAt: Date.now() },
];

app.use(bodyParser.json());

app.get("/messages", (req, res) => res.send(messages));
app.post("/messages", (req, res) => {
    const message = req.body;

    // Set color to a hsl color, using the first character of the user's name.
    // 97 is the ASCII for lowercase 'a', the * 8 just makes the colors vary more.
    message.fromStyle = `hsl(${(message.from.charCodeAt(0) - 97) * 8}, 50%, 50%)`;
    messages.push(message);

    res.sendStatus(201);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
