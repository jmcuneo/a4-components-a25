import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Results() {
    const [rsvps, setRsvps] = useState([]);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        yourname: "",
        event: "",
        numAdditional: 0,
        phoneNumber: "",
        emailAddress: "",
    });

    const fetchResults = async () => {
        const res = await fetch("/results");
        if (res.ok) {
            const data = await res.json();
            setRsvps(data);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleEditClick = (rsvp) => {
        setEditing(rsvp);
        setFormData({
            yourname: rsvp.yourname,
            event: rsvp.event,
            numAdditional: rsvp.totalGuests - 1,
            phoneNumber: rsvp.phoneNumber,
            emailAddress: rsvp.emailAddress,
        });
    };

    const handleDelete = async (id) => {
        const res = await fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        if (res.ok) fetchResults();
    };

    const handleSave = async () => {
        const updated = {
            yourname: formData.yourname,
            event: formData.event,
            totalGuests: parseInt(formData.numAdditional) + 1,
            phoneNumber: formData.phoneNumber,
            emailAddress: formData.emailAddress,
        };
        try {
            const res = await fetch(`/update/${editing._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });
            if (!res.ok) {
                const errData = await res.json();
                console.error("Save failed:", errData);
                return;
            }
            fetchResults();
            setEditing(null);
        } catch (err) {
            console.error("Save error:", err);
        }
    };


    return (
        <>
            <Navbar />
            <div className="results-container">
                <h1>RSVP Results</h1>

                <div className="results-table-wrapper">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Event</th>
                                <th>Total Guests</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rsvps.map((rsvp) => (
                                <tr key={rsvp._id}>
                                    <td>{rsvp.yourname}</td>
                                    <td>{rsvp.event}</td>
                                    <td>{rsvp.totalGuests}</td>
                                    <td>{rsvp.phoneNumber}</td>
                                    <td>{rsvp.emailAddress}</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditClick(rsvp)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(rsvp._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editing && (
                    <div className="overlay">
                        <div className="edit-card">
                            <h2>Edit RSVP</h2>

                            <label>Name</label>
                            <input
                                value={formData.yourname || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, yourname: e.target.value })
                                }
                            />

                            <label>Event</label>
                            <input
                                value={formData.event || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, event: e.target.value })
                                }
                            />

                            <label>Total Guests</label>
                            <input
                                type="number"
                                value={formData.numAdditional || 0}
                                onChange={(e) =>
                                    setFormData({ ...formData, numAdditional: e.target.value })
                                }
                            />

                            <label>Phone</label>
                            <input
                                value={formData.phoneNumber || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                                }
                            />

                            <label>Email</label>
                            <input
                                value={formData.emailAddress || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, emailAddress: e.target.value })
                                }
                            />

                            <div className="edit-buttons">
                                <button className="save-btn" onClick={handleSave}>
                                    Save
                                </button>
                                <button
                                    className="cancel-btn"
                                    onClick={() => setEditing(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
