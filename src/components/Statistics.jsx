function Statistics({ stats, showStats}) {
    if(stats.length === 0) return null;

    return (
        <div className={"statistics"}>
            <div className={`stat ${showStats ? "visible" : ""}`}>
                <table style={{width: "100%"}}>
                    <thead>
                    <tr>
                        <th>Game ID</th>
                        <th>Answer</th>
                        <th>Guesses</th>
                        <th>Won</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.map(stat => (
                        <tr key={stat.gameId}>
                            <td>{stat.gameId}</td>
                            <td>{stat.answer}</td>
                            <td>
                                {Array.isArray(stat.guesses) ? stat.guesses.join(", ") : (stat.guesses || "")}
                            </td>
                            <td>{stat.won.toString()}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Statistics;