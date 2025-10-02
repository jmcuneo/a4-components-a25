import React from 'react';
import '../styles/App.css';

const CarRow = ({ car, onEdit, onDelete }) => {
    const getEfficiencyBadgeClass = (efficiency) => {
        const classes = {
            'Poor': 'bg-danger',
            'Average': 'bg-warning',
            'Good': 'bg-info',
            'Excellent': 'bg-success'
        };
        return classes[efficiency] || 'bg-secondary';
    };

    return (
        <tr className="align-middle">
            <td className="ps-4 fw-semibold">{car.model}</td>
            <td>
                <span className="badge bg-light">{car.year}</span>
            </td>
            <td>
                <div className="d-flex align-items-center">
                    <span className="fw-semibold">{car.mpg}</span>
                    <small className="text-muted ms-1">MPG</small>
                </div>
            </td>
            <td>
                <span className={`badge ${getEfficiencyBadgeClass(car.efficiency)}`}>
                    {car.efficiency}
                </span>
            </td>
            <td>
                <span className="text-muted">{car.age} years</span>
            </td>
            <td className="text-center pe-4">
                <div className="d-flex gap-2 justify-content-center">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onEdit(car)}
                        title="Edit this vehicle"
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(car._id)}
                        title="Delete this vehicle"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CarRow;