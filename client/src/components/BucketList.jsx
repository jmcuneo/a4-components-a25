export default function BucketList({ items, onComplete, onDelete }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Active Items</h5>
        {items.length === 0 ? (
          <p className="text-muted">No active items yet.</p>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Target Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.priority === "High"
                          ? "bg-danger"
                          : item.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td>{item.targetDate || "—"}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => onComplete(item._id)}
                    >
                      <i className="bi bi-check-lg"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(item._id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
