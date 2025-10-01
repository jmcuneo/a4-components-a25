import React from 'react';

const CarRow = ({ car, onEdit, onDelete }) => {
    const getEfficiencyBadgeClass = (efficiency) => {
        const classes = {
            'Poor': 'bg-danger',
            'Average': 'bg-warning text-dark',
            'Good': 'bg-info text-dark',
            'Excellent': 'bg-success'
        };
        return classes[efficiency] || 'bg-secondary';
    };

    const getEfficiencyIcon = (efficiency) => {
        const icons = {
            'Poor': 'bi-emoji-frown',
            'Average': 'bi-emoji-neutral',
            'Good': 'bi-emoji-smile',
            'Excellent': 'bi-emoji-heart-eyes'
        };
        return icons[efficiency] || 'bi-emoji-expressionless';
    };

    return (
        <tr className="align-middle">
            <td className="ps-4 fw-semibold">{car.model}</td>
            <td>
                <span className="badge bg-light text-dark fs-6">{car.year}</span>
            </td>
            <td>
                <div className="d-flex align-items-center">
                    <i className="bi bi-fuel-pump text-muted me-2"></i>
                    <span className="fw-semibold">{car.mpg}</span>
                    <small className="text-muted ms-1">MPG</small>
                </div>
            </td>
            <td>
                <span className={`badge ${getEfficiencyBadgeClass(car.efficiency)} fs-6`}>
                    <i className={`bi ${getEfficiencyIcon(car.efficiency)} me-1`}></i>
                    {car.efficiency}
                </span>
            </td>
            <td>
                <span className="text-muted">{car.age} years</span>
            </td>
            <td className="text-center pe-4">
                <div className="btn-group btn-group-sm" role="group">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(car)}
                        title="Edit this vehicle"
                    >
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(car._id)}
                        title="Delete this vehicle"
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CarRow;