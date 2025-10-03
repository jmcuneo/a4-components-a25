import React, { useState } from 'react';
import EditCarModal from './EditCarModal';

const CarTable = ({ cars, loading, onUpdateCar, onDeleteCar }) => {
    const [editingCar, setEditingCar] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const getFuelTypeBadgeColor = (fuelType) => {
        const colors = {
            gasoline: 'warning',
            diesel: 'dark',
            electric: 'success',
            hybrid: 'info'
        };
        return colors[fuelType] || 'secondary';
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (updatedCar) => {
        const success = await onUpdateCar(editingCar._id, updatedCar);
        if (success) {
            setShowEditModal(false);
            setEditingCar(null);
        }
    };

    const handleDelete = async (carId) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            await onDeleteCar(carId);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">
                        <i className="fas fa-list me-2"></i>My Car Collection
                    </h5>
                </div>
                <div className="card-body">
                    {cars.length === 0 ? (
                        <div id="noCarsMessage" className="text-center text-muted mt-4">
                            <i className="fas fa-car fa-3x mb-3"></i>
                            <p>No cars in your collection yet. Add your first car above!</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover" id="dataTable">
                                <thead className="table-dark">
                                <tr>
                                    <th>Model</th>
                                    <th>Year</th>
                                    <th>MPG</th>
                                    <th>Fuel Type</th>
                                    <th>Age</th>
                                    <th>Features</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody id="carsTableBody">
                                {cars.map(car => (
                                    <tr key={car._id}>
                                        <td>{car.model}</td>
                                        <td>{car.year}</td>
                                        <td>{car.mpg}</td>
                                        <td>
                        <span className={`badge bg-${getFuelTypeBadgeColor(car.fuelType)}`}>
                          {car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}
                        </span>
                                        </td>
                                        <td>{car.age} years</td>
                                        <td>
                                            {car.features && car.features.length > 0 ? (
                                                car.features.map(feature => (
                                                    <span key={feature} className="badge bg-secondary me-1">
                              {feature}
                            </span>
                                                ))
                                            ) : (
                                                <span className="text-muted">None</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-1"
                                                onClick={() => handleEdit(car)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(car._id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditCarModal
                    car={editingCar}
                    onSave={handleSaveEdit}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    );
};

export default CarTable;