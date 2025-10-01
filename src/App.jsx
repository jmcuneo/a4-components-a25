import React, { useState, useEffect } from "react"

function App() {
    const [vinyls, setVinyls] = useState([])
    const [form, setForm] = useState({ vinyl: "", artist: "", owned: false, link: "" })
    const [editingSlug, setEditingSlug] = useState(null)
    const [editForm, setEditForm] = useState({ vinyl: "", artist: "", owned: false, link: "" })

    useEffect(() => {
        fetch("/results")
            .then(res => res.json())
            .then(data => setVinyls(data))
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        fetch("/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => {
                setVinyls(data)
                setForm({ vinyl: "", artist: "", owned: false, link: "" })
            })
    }

    function handleDelete(slug) {
        fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug })
        })
            .then(res => res.json())
            .then(data => setVinyls(data))
    }

    function handleEdit(v) {
        setEditingSlug(v.slug)
        setEditForm({ vinyl: v.vinyl, artist: v.artist, owned: v.owned, link: v.link })
    }

    function handleUpdate(slug) {
        fetch("/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...editForm, slug })
        })
            .then(res => res.json())
            .then(data => {
                setVinyls(data)
                setEditingSlug(null)
            })
    }

    return (
        <div>
            <h1>🎵 Vinyl Checklist</h1>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <label>Vinyl Name</label>
                    <input
                        type="text"
                        value={form.vinyl}
                        onChange={e => setForm({ ...form, vinyl: e.target.value })}
                        required
                    />

                    <label>Artist</label>
                    <input
                        type="text"
                        value={form.artist}
                        onChange={e => setForm({ ...form, artist: e.target.value })}
                        required
                    />

                    <label>
                        <input
                            type="checkbox"
                            checked={form.owned}
                            onChange={e => setForm({ ...form, owned: e.target.checked, link: "" })}
                        />
                        Owned?
                    </label>

                    {!form.owned && (
                        <>
                            <label>Purchase Link</label>
                            <input
                                type="url"
                                value={form.link}
                                onChange={e => setForm({ ...form, link: e.target.value })}
                            />
                        </>
                    )}

                    <button type="submit">Add Vinyl</button>
                </form>
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
                        {editingSlug === v.slug ? (
                            <>
                                <td><input value={editForm.vinyl} onChange={e => setEditForm({ ...editForm, vinyl: e.target.value })}/></td>
                                <td><input value={editForm.artist} onChange={e => setEditForm({ ...editForm, artist: e.target.value })}/></td>
                                <td><input type="checkbox" checked={editForm.owned} onChange={e => setEditForm({ ...editForm, owned: e.target.checked })}/></td>
                                <td>
                                    {!editForm.owned && (
                                        <input value={editForm.link} onChange={e => setEditForm({ ...editForm, link: e.target.value })}/>
                                    )}
                                </td>
                                <td>
                                    <button className="saveButton" onClick={() => handleUpdate(v.slug)}>Save</button>
                                    <button className="cancelButton" onClick={() => setEditingSlug(null)}>Cancel</button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{v.vinyl}</td>
                                <td>{v.artist}</td>
                                <td>{v.owned ? "✅" : "❌"}</td>
                                <td>{v.link && <a href={v.link} target="_blank">Buy</a>}</td>
                                <td>
                                    <button className="editButton" onClick={() => handleEdit(v)}>Edit</button>
                                    <button className="deleteButton" onClick={() => handleDelete(v.slug)}>Delete</button>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
