export default function CarTable({ cars, onEdit }) {
    return (
        <table>
            <thead>
            <tr><th>Model</th><th>Year</th><th>MPG</th><th>Age</th><th>Edit</th></tr>
            </thead>
            <tbody>
            {cars.map(car => (
                <tr key={car.model}>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td>{car.mpg}</td>
                    <td>{car.age}</td>
                    <td><button onClick={() => onEdit(car.model)}>Edit</button></td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
