import { useState, useEffect } from "react";
import CarForm from "./components/CarForm.jsx";
import CarTable from "./components/CarTable.jsx";

export default function App() {
    const [cars, setCars] = useState([]);
    const [editingCar, setEditingCar] = useState(null);

    useEffect(() => {
        fetch("/results")
            .then(res => res.json())
            .then(data => setCars(data));
    }, []);

    const handleSubmit = async (car) => {
        const method = editingCar ? "PUT" : "POST";
        const response = await fetch("/submit", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(car)
        });
        const updated = await response.json();
        setCars(updated);
        setEditingCar(null);
    };

    const handleEdit = (model) => {
        const car = cars.find(c => c.model === model);
        if (car) setEditingCar(car);
    };

    return (
        <div>
            <h1>Car Tracker</h1>
            <CarForm onSubmit={handleSubmit} editingCar={editingCar} />
            <CarTable cars={cars} onEdit={handleEdit} />
        </div>
    );
}
