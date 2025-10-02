function CarTable({ cars, onEdit, onDelete }) {
    return (
        <div id="results">
            <table className="w-full table-auto border border-white text-sm text-white" role="table">
                <thead>
                <tr className="bg-gray-800">
                    <th className="border border-white px-4 py-2">Model</th>
                    <th className="border border-white px-4 py-2">Year</th>
                    <th className="border border-white px-4 py-2">MPG</th>
                    <th className="border border-white px-4 py-2">Age</th>
                    <th className="border border-white px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {cars.map((car, index) => (
                    <tr
                        key={car.model}
                        className={index % 2 === 0 ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}
                    >
                        <td className="border border-white px-4 py-2">{car.model}</td>
                        <td className="border border-white px-4 py-2">{car.year}</td>
                        <td className="border border-white px-4 py-2">{car.mpg}</td>
                        <td className="border border-white px-4 py-2">{car.age ?? new Date().getFullYear() - car.year}</td>
                        <td className="border border-white px-4 py-2">
                            <button
                                className="bg-yellow-500 text-black px-2 py-1 rounded mr-2"
                                onClick={() => onEdit(car)}
                                aria-label={`Edit ${car.model}`}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-600 text-white px-2 py-1 rounded"
                                onClick={() => onDelete(car.model)}
                                aria-label={`Delete ${car.model}`}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default CarTable
