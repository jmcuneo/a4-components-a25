import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
    const [form, setForm] = useState({
        yourname: "",
        event: "",
        numAdditional: 0,
        phoneNumber: "",
        emailAddress: "",
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                alert("RSVP submitted successfully!");
                setForm({ yourname: "", event: "", numAdditional: 0, phoneNumber: "", emailAddress: "" });
            } else {
                alert(data.error || "Error submitting RSVP. Must be signed in.");
            }
        } catch {
            alert("Server error. Please try again later.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="form-card">
                <h1 className="form-title">RSVP</h1>
                <form onSubmit={handleSubmit} className="form">
                    <label>Your Name</label>
                    <input
                        name="yourname"
                        value={form.yourname}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="form-input"
                    />

                    <fieldset className="form-fieldset">
                        <legend className="form-legend">Event</legend>
                        {["Wedding", "Birthday Party", "Gala"].map(ev => (
                            <label key={ev} className="form-radio-label">
                                <input
                                    type="radio"
                                    name="event"
                                    value={ev}
                                    checked={form.event === ev}
                                    onChange={handleChange}
                                /> {ev}
                            </label>
                        ))}
                    </fieldset>

                    <label>Additional Guests</label>
                    <input
                        type="number"
                        name="numAdditional"
                        min="0"
                        value={form.numAdditional}
                        onChange={handleChange}
                        className="form-input"
                    />

                    <label>Phone</label>
                    <input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="form-input"
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="emailAddress"
                        value={form.emailAddress}
                        onChange={handleChange}
                        className="form-input"
                    />

                    <button type="submit" className="submit-btn btn">Submit</button>
                </form>
            </div>
        </>
    );
}
