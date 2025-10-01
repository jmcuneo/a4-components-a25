import React, { useState } from 'react';
import CarRow from './CarRow';

const CarTable = ({ cars, onCarsUpdated, onShowAlert }) => {
    const [editingCar, setEditingCar] = useState(null);
    const [editFormData, setEditFormData] = useState({
        model: '',
        year: '',
        mpg: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditClick = (car) => {
        setEditingCar(car);
        setEditFormData({
            model: car.model,
            year: car.year,
            mpg: car.mpg
        });
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!editFormData.model || !editFormData.year || !editFormData.mpg) {
            onShowAlert('Please fill in all fields', 'danger');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/cars/${editingCar._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editFormData)
            });

            const result = await response.json();

            if (result.success) {
                setEditingCar(null);
                onShowAlert('Car updated successfully! ✨', 'success');
                onCarsUpdated();
            } else {
                onShowAlert('Error updating car: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error updating car:', error);
            onShowAlert('Error updating car. Please try again.', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCar = async (carId) => {
        if (!window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/cars/${carId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                onShowAlert('Car deleted successfully! 🗑️', 'success');
                onCarsUpdated();
            } else {
                onShowAlert('Error deleting car: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error deleting car:', error);
            onShowAlert('Error deleting car. Please try again.', 'danger');
        }
    };

    const closeModal = () => {
        setEditingCar(null);
        setIsSubmitting(false);
    };

    if (!cars || cars.length === 0) {
        return (
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h4 className="mb-0 text-primary">
                        <i className="bi bi-table me-2"></i>
                        Your Car Inventory
                    </h4>
                </div>
                <div className="card-body text-center py-5">
                    <i className="bi bi-car-front display-1 text-muted mb-3"></i>
                    <h5 className="text-muted">No cars in your inventory yet</h5>
                    <p className="text-muted">Add your first vehicle to get started!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-primary">
                    <i className="bi bi-table me-2"></i>
                    Your Car Inventory
                </h4>
                <span className="badge bg-primary fs-6">
                    {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'}
                </span>
            </div>
            <div className="card-body p-0">
                {/* Edit Modal */}
                {editingCar && (
                    <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Edit Vehicle
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={closeModal}
                                        disabled={isSubmitting}
                                    ></button>
                                </div>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="editModel" className="form-label fw-semibold">Model</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="editModel"
                                                name="model"
                                                value={editFormData.model}
                                                onChange={handleEditChange}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editYear" className="form-label fw-semibold">Year</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="editYear"
                                                name="year"
                                                value={editFormData.year}
                                                onChange={handleEditChange}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editMpg" className="form-label fw-semibold">MPG</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="editMpg"
                                                name="mpg"
                                                value={editFormData.mpg}
                                                onChange={handleEditChange}
                                                step="0.1"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={closeModal}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-lg me-2"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                        <tr>
                            <th className="ps-4">
                                <i className="bi bi-tag me-2"></i>
                                Model
                            </th>
                            <th>
                                <i className="bi bi-calendar me-2"></i>
                                Year
                            </th>
                            <th>
                                <i className="bi bi-fuel-pump me-2"></i>
                                MPG
                            </th>
                            <th>
                                <i className="bi bi-graph-up me-2"></i>
                                Efficiency
                            </th>
                            <th>
                                <i className="bi bi-clock me-2"></i>
                                Age
                            </th>
                            <th className="text-center pe-4">
                                <i className="bi bi-gear me-2"></i>
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {cars.map(car => (
                            <CarRow
                                key={car._id}
                                car={car}
                                onEdit={handleEditClick}
                                onDelete={handleDeleteCar}
                            />
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CarTable;