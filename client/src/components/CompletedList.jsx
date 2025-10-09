export default function CompletedList({ items, onDelete }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Completed Items</h5>
        {items.length === 0 ? (
          <p className="text-muted">No completed items yet.</p>
        ) : (
          <ul className="list-group">
            {items.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  {item.title}
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onDelete(item._id)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
