import React, { useState } from 'react';

// The 'onPatientAdded' prop is a function passed down from App.jsx
// to notify it when a new patient has been successfully added.
function AddPatientForm({ onPatientAdded }) {
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !weight || !height) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch('/api/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, weight, height }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to add patient.');
            }

            // Clear the form
            setName('');
            setWeight('');
            setHeight('');

            // Notify the parent component to refetch the data
            if (onPatientAdded) {
                onPatientAdded();
            }

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-4xl mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Add New Patient</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Weight (kg)"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Height (m)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="mt-4 text-right">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Patient
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPatientForm;

