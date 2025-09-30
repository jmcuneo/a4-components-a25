export default function BucketList({ items, onComplete, onDelete }) {
  const activeItems = items.filter(i => !i.completed);

  if (activeItems.length === 0) {
    return <p>No active items 🎉</p>;
  }

  return (
    <>
      <h2>Active Items</h2>
      <ul>
        {activeItems.map(item => (
          <li key={item._id}>
            <span>
              <b>{item.title}</b> — {item.category}, {item.priority}
              {item.targetDate && ` (target: ${item.targetDate})`}
            </span>
            <span>
              <button onClick={() => onComplete(item._id)}>✔</button>
              <button onClick={() => onDelete(item._id)} style={{marginLeft:"8px", background:"#e74c3c"}}>🗑</button>
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
