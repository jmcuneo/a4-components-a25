function GameForm({ guess, setGuess, onSubmit, onNewGame, onToggleStats}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    }

    const handleNewGame = (e) => {
        e.preventDefault();
        onNewGame();
    }

    const handleToggleStats = (e) => {
        e.preventDefault();
        onToggleStats();
    }

    return (
        <form className={"game-form"}>
            <div className={"form-group"}>
                <label htmlFor={"guess"}>Guess</label>
                <input
                    type={"number"}
                    id={"guess"}
                    value={guess}
                    min={"1"}
                    max={"10"}
                    onChange={(e) => setGuess(e.target.value)}
                    />
            </div>

            <div className={"form-group"}>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={handleNewGame}>New Game</button>
                <button onClick={handleToggleStats}>View Statistics</button>
            </div>

        </form>
    )
}

export default GameForm;