import { useState, useEffect } from "react";

const weightOptions = [125, 133, 141, 149, 157, 165, 174, 184, 197, 285];
const classOptions = ["Freshman", "Sophomore", "Junior", "Senior"];

export default function WrestlerTable() {
  const [wrestlers, setWrestlers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingRowData, setEditingRowData] = useState({});

  const fetchWrestlers = async () => {
    try {
      const res = await fetch("/api/wrestlers");
      if (!res.ok) throw new Error("Failed to fetch wrestlers");
      const data = await res.json();
      setWrestlers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWrestlers();
  }, []);

  const startEdit = (wrestler) => {
    setEditingId(wrestler._id);
    setEditingRowData({ ...wrestler });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingRowData({});
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`/api/wrestlers/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingRowData),
      });
      if (!res.ok) throw new Error("Failed to save wrestler");
      const data = await res.json();
      setWrestlers(data);
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWrestler = async (id) => {
    try {
      const res = await fetch(`/api/wrestlers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete wrestler");
      const data = await res.json();
      setWrestlers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addWrestler = async (wrestler) => {
    try {
      const res = await fetch("/api/wrestlers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wrestler),
      });
      if (!res.ok) throw new Error("Failed to add wrestler");
      const data = await res.json();
      setWrestlers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Form for adding new wrestler
  const [newWrestler, setNewWrestler] = useState({
    name: "",
    weight: "",
    class: "",
    wins: 0,
    losses: 0,
  });

  const handleNewSubmit = (e) => {
    e.preventDefault();
    addWrestler(newWrestler);
    setNewWrestler({ name: "", weight: "", class: "", wins: 0, losses: 0 });
  };

  return (
    <div>
      <h2>Add Wrestler</h2>
      <form onSubmit={handleNewSubmit}>
        <input
          placeholder="Name"
          value={newWrestler.name}
          onChange={(e) => setNewWrestler({ ...newWrestler, name: e.target.value })}
        />
        <select
          value={newWrestler.weight}
          onChange={(e) => setNewWrestler({ ...newWrestler, weight: e.target.value })}
        >
          <option value="">Weight</option>
          {weightOptions.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        <select
          value={newWrestler.class}
          onChange={(e) => setNewWrestler({ ...newWrestler, class: e.target.value })}
        >
          <option value="">Class</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Wins"
          value={newWrestler.wins}
          onChange={(e) => setNewWrestler({ ...newWrestler, wins: parseInt(e.target.value) || 0 })}
        />
        <input
          type="number"
          placeholder="Losses"
          value={newWrestler.losses}
          onChange={(e) => setNewWrestler({ ...newWrestler, losses: parseInt(e.target.value) || 0 })}
        />
        <button type="submit">Add</button>
      </form>

      <h2>Wrestlers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Weight</th>
            <th>Class</th>
            <th>Record</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wrestlers.map((w) => (
            <tr key={w._id}>
              <td>
                {editingId === w._id ? (
                  <input
                    value={editingRowData.name}
                    onChange={(e) => setEditingRowData({ ...editingRowData, name: e.target.value })}
                  />
                ) : w.name}
              </td>
              <td>
                {editingId === w._id ? (
                  <select
                    value={editingRowData.weight}
                    onChange={(e) => setEditingRowData({ ...editingRowData, weight: e.target.value })}
                  >
                    {weightOptions.map((wgt) => (
                      <option key={wgt} value={wgt}>{wgt}</option>
                    ))}
                  </select>
                ) : w.weight}
              </td>
              <td>
                {editingId === w._id ? (
                  <select
                    value={editingRowData.class}
                    onChange={(e) => setEditingRowData({ ...editingRowData, class: e.target.value })}
                  >
                    {classOptions.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                ) : w.class}
              </td>
              <td>
                {editingId === w._id ? (
                  <>
                    <input
                      type="number"
                      value={editingRowData.wins}
                      style={{ width: 50 }}
                      onChange={(e) =>
                        setEditingRowData({ ...editingRowData, wins: parseInt(e.target.value) || 0 })
                      }
                    />
                    -
                    <input
                      type="number"
                      value={editingRowData.losses}
                      style={{ width: 50 }}
                      onChange={(e) =>
                        setEditingRowData({ ...editingRowData, losses: parseInt(e.target.value) || 0 })
                      }
                    />
                  </>
                ) : (
                  `${w.wins}-${w.losses}`
                )}
              </td>
              <td>
                {editingId === w._id ? (
                  <>
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(w)}>Edit</button>
                    <button onClick={() => deleteWrestler(w._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
