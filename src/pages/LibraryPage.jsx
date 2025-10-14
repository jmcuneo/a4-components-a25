import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LibraryPage() {
    const [data, setData] = useState([])
    const [form, setForm] = useState({
        name: '',
        btitle: '',
        checkeddate: '',
        returndate: '',
    })
    const navigate = useNavigate()

    const updateTable = async () => {
        const res = await fetch('/getdata')
        if (res.ok) {
            const json = await res.json()
            setData(json)
        } else if (res.status === 401) {
            navigate('/')
        }
    }

    useEffect(() => {
        updateTable()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        setForm({ name: '', btitle: '', checkeddate: '', returndate: '' })
        updateTable()
    }

    const handleDelete = async (id) => {
        await fetch('/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: id }),
        })
        updateTable()
    }

    const handleEdit = async (entry) => {
        const name = prompt('Enter new name:', entry.name)
        const btitle = prompt('Enter new book title:', entry.btitle)
        const checkeddate = prompt('Enter new checked-out date:', entry.checkeddate)
        const returndate = prompt('Enter new return date:', entry.returndate)

        if (name && btitle) {
            await fetch('/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: entry._id,
                    name,
                    btitle,
                    checkeddate,
                    returndate,
                }),
            })
            updateTable()
        }
    }

    const logout = async () => {
        await fetch('/logout', { method: 'POST' })
        navigate('/')
    }

    const calcDays = (c, r) => {
        if (!c || !r) return 'Book not returned'
        const cd = new Date(c)
        const rd = new Date(r)
        const days = (rd - cd) / (1000 * 60 * 60 * 24)
        if (isNaN(days)) return 'Invalid date'
        if (days < 0) return 'Time traveled?'
        return days.toFixed(1)
    }

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Your Library</h1>
                <p className="subtitle">Please fill out the form to update the database.</p>

                <form className="box" onSubmit={handleSubmit}>
                    <div className="field">
                        <label className="label">Full Name</label>
                        <input
                            className="input"
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Book Title</label>
                        <input
                            className="input"
                            type="text"
                            value={form.btitle}
                            onChange={(e) => setForm({ ...form, btitle: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Checked Out Date</label>
                        <input
                            className="input"
                            type="date"
                            value={form.checkeddate}
                            onChange={(e) => setForm({ ...form, checkeddate: e.target.value })}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Return Date</label>
                        <input
                            className="input"
                            type="date"
                            value={form.returndate}
                            onChange={(e) => setForm({ ...form, returndate: e.target.value })}
                        />
                    </div>

                    <div className="field is-grouped">
                        <div className="control">
                            <button type="submit" className="button is-link">Submit</button>
                        </div>
                        <div className="control">
                            <button type="button" className="button is-light" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </form>

                <div className="table-container">
                    <table className="table is-fullwidth is-striped is-hoverable">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Book</th>
                            <th>Checked</th>
                            <th>Returned</th>
                            <th>Days</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((entry) => (
                            <tr key={entry._id}>
                                <td>{entry.name}</td>
                                <td>{entry.btitle}</td>
                                <td>{entry.checkeddate}</td>
                                <td>{entry.returndate}</td>
                                <td>{calcDays(entry.checkeddate, entry.returndate)}</td>
                                <td>
                                    <button
                                        className="button is-small is-info"
                                        onClick={() => handleEdit(entry)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="button is-small is-danger"
                                        onClick={() => handleDelete(entry._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}
