export default function CompletedList({ items }) {
  return (
    <div>
      <h2>Completed</h2>
      <ul>
        {items.filter(i => i.completed).map(item => (
          <li key={item._id}>
            ✅ {item.title} ({item.category}, {item.priority})
          </li>
        ))}
      </ul>
    </div>
  );
}
