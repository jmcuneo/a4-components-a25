import React, { useState, useEffect } from 'react';

const EditCarModal = ({ car, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        model: '',
        year: '',
        mpg: '',
        fuelType: 'gasoline'
    });

    useEffect(() => {
        if (car) {
            setFormData({
                model: car.model,
                year: car.year.toString(),
                mpg: car.mpg.toString(),
                fuelType: car.fuelType
            });
        }
    }, [car]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedCar = {
            model: formData.model,
            year: parseInt(formData.year),
            mpg: parseInt(formData.mpg),
            fuelType: formData.fuelType
        };
        onSave(updatedCar);
    };

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Car</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form id="editForm" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="editModel" className="form-label">Model</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editModel"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editYear" className="form-label">Year</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="editYear"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editMpg" className="form-label">MPG</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="editMpg"
                                    name="mpg"
                                    value={formData.mpg}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editFuelType" className="form-label">Fuel Type</label>
                                <select
                                    className="form-select"
                                    id="editFuelType"
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleChange}
                                >
                                    <option value="gasoline">Gasoline</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCarModal;