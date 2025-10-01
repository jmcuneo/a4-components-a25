import { useState, useEffect } from "react";
import GameForm from "./components/GameForm";
import Statistics from "./components/Statistics";

function App() {
    const [gameId, setGameId] = useState(0);
    const [guess, setGuess] = useState(1);
    const [stats, setStats] = useState([]);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        initGame()
    }, [gameId])

    useEffect(() => {
        displayGames()
    }, [gameId])

    useEffect(() => {
        return () => {
            clearAppData()
        }
    }, []);

    const initGame = async () => {
        const json = {
            gameId: gameId,
            answer: Math.floor(Math.random() * 10) + 1,
            guesses: [],
            won: false
        }

        await fetch("/game", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(json)
        })
    }

    const submit = async () => {
        const json = {
            gameId: gameId,
            guess: guess
        }

        const res = await fetch("/guess", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(json)
        })

        const output = await res.text();

        if(output === "correct") {
            setGameId(gameId + 1)
        } else {
            displayGames();
        }
    }

    const displayGames = async () => {
        const res = await fetch("/stats", {
            method: "GET"
        })

        const statsList = JSON.parse(await res.text());
        setStats(statsList);
    }

    const handleNewGame = () => {
        setGameId(gameId + 1)
        setGuess(1)
    }

    const toggleStats = () => {
        setShowStats(!showStats)
    }

    const clearAppData = async () => {
        await fetch("/*", {
            method: "DELETE"
        })
    }

    return <div className="app">
        <header>
            <h1>Number Guessing Game</h1>
            <p className={"subtitle"}>Guess a number between 1 and 10</p>
        </header>

        <main>
            <GameForm
                guess={guess}
                setGuess={setGuess}
                onSubmit={submit}
                onNewGame={handleNewGame}
                onToggleStats={toggleStats}
            />

            <Statistics
                stats={stats}
                showStats={showStats}
            />
        </main>
    </div>
}

export default App;