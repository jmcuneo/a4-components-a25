import { useState, useEffect } from 'react'

function CarForm({ onSubmit, editingCar, cancelEdit }) {
    const [model, setModel] = useState('')
    const [year, setYear] = useState('')
    const [mpg, setMpg] = useState('')

    useEffect(() => {
        if (editingCar) {
            setModel(editingCar.model)
            setYear(editingCar.year)
            setMpg(editingCar.mpg)
        } else {
            setModel('')
            setYear('')
            setMpg('')
        }
    }, [editingCar])

    const handleSubmit = (e) => {
        e.preventDefault()
        const age = new Date().getFullYear() - parseInt(year)
        onSubmit({ model, year: parseInt(year), mpg: parseInt(mpg), age }, editingCar ? 'edit' : 'add')
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2" id="carform">
            <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Model"
                className="px-2 py-1 bg-gray-800 rounded w-full"
            />
            <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                className="px-2 py-1 bg-gray-800 rounded w-full"
            />
            <input
                type="number"
                value={mpg}
                onChange={(e) => setMpg(e.target.value)}
                placeholder="MPG"
                className="px-2 py-1 bg-gray-800 rounded w-full"
            />
            <div>
                <button type="submit" className="bg-green-600 px-4 py-1 rounded mr-2">
                    {editingCar ? 'Update Car' : 'Add Car'}
                </button>
                {editingCar && (
                    <button type="button" onClick={cancelEdit} className="bg-gray-600 px-4 py-1 rounded">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}

export default CarForm
