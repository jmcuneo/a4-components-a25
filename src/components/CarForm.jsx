import { useState, useEffect } from "react";

export default function CarForm({ onSubmit, editingCar }) {
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mpg, setMpg] = useState("");

    useEffect(() => {
        if (editingCar) {
            setModel(editingCar.model);
            setYear(editingCar.year);
            setMpg(editingCar.mpg);
        }
    }, [editingCar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ model, year: parseInt(year), mpg: parseInt(mpg) });
        setModel("");
        setYear("");
        setMpg("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={model} onChange={e => setModel(e.target.value)} placeholder="Model" required />
            <input value={year} onChange={e => setYear(e.target.value)} type="number" placeholder="Year" required />
            <input value={mpg} onChange={e => setMpg(e.target.value)} type="number" placeholder="MPG" required />
            <button type="submit">{editingCar ? "Update Car" : "Add Car"}</button>
        </form>
    );
}
