import React, { useEffect, useState } from "react";

export default function App() {

    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        item: "",
        author: "",
        section: "",
        borrowed: "",
        due: "",
    });

    useEffect(() => {
        fetchLoans();
    }, []);

    async function fetchLoans() {
        try {
            const res = await fetch("/results");

            if (res.status === 401) {
                window.location.href = "/";
                return;
            }

            const data = await res.json();
            setLoans(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>

    async function handleSubmit(e) {
        e.preventDefault();

        await fetch("/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
        });

        setFormData({item: "", author: "", section: "", borrowed: "", due: ""});
        fetchLoans();
    }

    async function handleDelete(index) {
        await fetch("/delete", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({index}),
        });
        fetchLoans();
    }

    async function handleModify(index) {
        const loan = loans[index];

        const newItem =
            prompt("Enter new item name:", loan.item) || loan.item;
        const newAuthor =
            prompt("Enter new author:", loan.author || "") || loan.author;
        const newSection =
            prompt("Enter new library section:", loan.section) || loan.section;
        const newBorrowed =
            prompt("Enter new borrowed date (yyyy-mm-dd):", loan.borrowed) ||
            loan.borrowed;
        const newDue =
            prompt("Enter new due date (yyyy-mm-dd):", loan.due) || loan.due;

        if (!newItem || !newSection || !newBorrowed || !newDue) {
            alert("Modification cancelled or missing required fields.");
            return;
        }

        const updatedLoan = {
            item: newItem,
            author: newAuthor,
            section: newSection,
            borrowed: newBorrowed,
            due: newDue,
        };

        await fetch(`/update/${index}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedLoan),
        });

        fetchLoans();
    }

    return (
        <div id="body-flex-box" className="flex flex-row justify-center m-2.5 mt-8 gap-x-8">

            <div id="form-box" className="m-4">
                <h2 className="text-xl font-semibold mb-2">Create New Loan</h2>
                <p className="text-md text-gray-600">
                    Fill out the below fields in order to add a new loan entry.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    <i>
                        Entries in <span className="text-red-600">red</span> and marked with{" "}
                        <span className="text-red-600">*</span> are required.
                    </i>
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <label htmlFor="item" className="block">
                        <span className="text-red-600">Item Name*</span>:
                        <input
                            id="item"
                            name="item"
                            placeholder="Item"
                            required
                            value={formData.item}
                            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                            className="border border-gray-400 rounded px-2 py-1 w-full mt-1"
                        />
                    </label>

                    <label htmlFor="author" className="block">
                        Author (if applicable):
                        <input
                            id="author"
                            name="author"
                            placeholder="Author"
                            value={formData.author}
                            onChange={(e) =>
                                setFormData({ ...formData, author: e.target.value })
                            }
                            className="border border-gray-400 rounded px-2 py-1 w-full mt-1"
                        />
                    </label>

                    <label htmlFor="section" className="block">
                        <span className="text-red-600">Library Section*</span>:
                        <input
                            id="section"
                            name="section"
                            placeholder="Section"
                            required
                            value={formData.section}
                            onChange={(e) =>
                                setFormData({ ...formData, section: e.target.value })
                            }
                            className="border border-gray-400 rounded px-2 py-1 w-full mt-1"
                        />
                    </label>

                    <label htmlFor="borrowed" className="block">
                        <span className="text-red-600">Date Borrowed*</span>:
                        <input
                            type="date"
                            id="borrowed"
                            name="borrowed"
                            required
                            value={formData.borrowed}
                            onChange={(e) =>
                                setFormData({ ...formData, borrowed: e.target.value })
                            }
                            className="border border-gray-400 rounded px-2 py-1 w-full mt-1"
                        />
                    </label>

                    <label htmlFor="due" className="block">
                        <span className="text-red-600">Return Due*</span>:
                        <input
                            type="date"
                            id="due"
                            name="due"
                            required
                            value={formData.due}
                            onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                            className="border border-gray-400 rounded px-2 py-1 w-full mt-1"
                        />
                    </label>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-800 active:bg-blue-700 transition"
                    >
                        Add Loan
                    </button>
                </form>
            </div>

            <div id="results-box" className="m-4">
                <h2 className="text-xl font-semibold mb-2">Existing Loans</h2>
                <p className="text-md text-gray-600 mb-4">
                    Your created loans will show up in this table.
                    <br />
                    The <span className="text-red-600 font-bold">DELETE</span> button will
                    remove the associated loan.
                    <br />
                    The <span className="text-red-600 font-bold">MODIFY</span> button will
                    allow you to edit the fields of the associated loan.
                </p>

                <table
                    id="results"
                    className="border border-black border-collapse w-full"
                >
                    <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Author</th>
                        <th className="px-4 py-2">Section</th>
                        <th className="px-4 py-2">Borrowed</th>
                        <th className="px-4 py-2">Due</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loans.map((loan, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-100">
                            <td className="px-4 py-2">{loan.item}</td>
                            <td className="px-4 py-2">{loan.author || "-"}</td>
                            <td className="px-4 py-2">{loan.section}</td>
                            <td className="px-4 py-2">{loan.borrowed}</td>
                            <td className="px-4 py-2">{loan.due}</td>
                            <td className="px-4 py-2 flex gap-2">
                                <button
                                    onClick={() => handleDelete(idx)}
                                    className="bg-red-600 text-white rounded-md px-3 py-1 text-sm hover:bg-red-700 active:bg-red-800 transition-colors"
                                >
                                    DELETE
                                </button>
                                <button
                                    onClick={() => handleModify(idx)}
                                    className="bg-red-600 text-white rounded-md px-3 py-1 text-sm hover:bg-red-700 active:bg-red-800 transition-colors"
                                >
                                    MODIFY
                                </button>
                            </td>
                        </tr>
                    ))}
                    {loans.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                No loans recorded.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}