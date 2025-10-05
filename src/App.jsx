
import { useState, useEffect } from 'react'
import CarForm from './CarForm.jsx'
import CarTable from './CarTable.jsx'
import './App.css'

function App() {
    const [cars, setCars] = useState([])
    const [editingCar, setEditingCar] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function init() {
            try {
                const res = await fetch('/read')
                const data = await res.json()
                setCars(data)
            } catch {
                setCars([])
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    const handleAddOrUpdate = async (car, mode) => {
        const method = mode === 'edit' ? 'PUT' : 'POST'
        const res = await fetch('/submit', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(car)
        })
        const updated = await res.json()
        setCars(updated)
        setEditingCar(null)
    }

    const handleDelete = async (model) => {
        const res = await fetch('/submit', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model })
        })
        const updated = await res.json()
        setCars(updated)
    }

    if (loading) return <p className="text-white p-4">Loading...</p>

    return (
        <div className="App p-4 text-white">
            <h1 className="text-xl font-bold mb-4">Car Tracker</h1>
            <CarForm
                onSubmit={handleAddOrUpdate}
                editingCar={editingCar}
                cancelEdit={() => setEditingCar(null)}
            />
            <CarTable
                cars={cars}
                onEdit={(car) => setEditingCar(car)}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default App
