import { useState, useEffect } from "react";

function App() {
    const [vinyls, setVinyls] = useState([]);
    const [form, setForm] = useState({ vinyl: "", artist: "", owned: false, link: "" });

    useEffect(() => {
        fetch("/api/read")
            .then(res => res.json())
            .then(data => setVinyls(data));
    }, []);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }

    function addVinyl() {
        const slug = `${form.vinyl}-${form.artist}`.toLowerCase().replace(/\s+/g, "-");
        const newVinyl = { ...form, slug };
        fetch("/api/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newVinyl)
        })
            .then(res => res.json())
            .then(data => {
                setVinyls(data);
                setForm({ vinyl: "", artist: "", owned: false, link: "" });
            });
    }

    function deleteVinyl(slug) {
        fetch("/api/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug })
        })
            .then(res => res.json())
            .then(data => setVinyls(data));
    }

    return (
        <div className="container">
            <h1>🎵 Vinyl Checklist</h1>

            <div className="card">
                <label>Vinyl Name</label>
                <input name="vinyl" value={form.vinyl} onChange={handleChange} />
                <label>Artist</label>
                <input name="artist" value={form.artist} onChange={handleChange} />
                <label>
                    <input type="checkbox" name="owned" checked={form.owned} onChange={handleChange} />
                    Owned?
                </label>
                <label>Purchase Link</label>
                <input name="link" value={form.link} onChange={handleChange} />
                <button onClick={addVinyl}>Add Vinyl</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Vinyl</th>
                    <th>Artist</th>
                    <th>Owned</th>
                    <th>Link</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {vinyls.map(v => (
                    <tr key={v.slug}>
                        <td>{v.vinyl}</td>
                        <td>{v.artist}</td>
                        <td>{v.owned ? "✅" : "❌"}</td>
                        <td>{v.link && <a href={v.link} target="_blank">Buy</a>}</td>
                        <td>
                            <button onClick={() => deleteVinyl(v.slug)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
