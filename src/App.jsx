import React, { useState, useEffect } from "react"

const App = () => {
    const [vinyls, setVinyls] = useState([])
    const [vinyl, setVinyl] = useState("")
    const [artist, setArtist] = useState("")
    const [owned, setOwned] = useState(false)
    const [link, setLink] = useState("")

    useEffect(() => {
        fetch("/read")
            .then(res => res.json())
            .then(data => setVinyls(data))
    }, [])

    function addVinyl() {
        fetch("/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vinyl, artist, owned, link })
        })
            .then(res => res.json())
            .then(data => {
                setVinyls(data)
                setVinyl("")
                setArtist("")
                setOwned(false)
                setLink("")
            })
    }

    function deleteVinyl(slug) {
        fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug })
        })
            .then(res => res.json())
            .then(data => setVinyls(data))
    }

    return (
        <div className="container">
            <h1>🎵 Vinyl Checklist</h1>
            <div className="form-card">
                <input
                    type="text"
                    placeholder="Vinyl Name"
                    value={vinyl}
                    onChange={e => setVinyl(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Artist"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={owned}
                        onChange={e => setOwned(e.target.checked)}
                    />
                    Owned?
                </label>
                {!owned && (
                    <input
                        type="url"
                        placeholder="Purchase Link"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                    />
                )}
                <button onClick={addVinyl}>Add Vinyl</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Vinyl</th>
                    <th>Artist</th>
                    <th>Owned?</th>
                    <th>Link</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {vinyls.map((v, i) => (
                    <tr key={i}>
                        <td>{v.vinyl}</td>
                        <td>{v.artist}</td>
                        <td>{v.owned ? "✅" : "❌"}</td>
                        <td>{v.link && <a href={v.link}>Buy</a>}</td>
                        <td>
                            <button onClick={() => deleteVinyl(v.slug)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
