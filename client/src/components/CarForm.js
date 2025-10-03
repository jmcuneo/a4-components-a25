import React, { useState } from 'react';

const CarForm = ({ onAddCar }) => {
    const [formData, setFormData] = useState({
        model: '',
        year: '',
        mpg: '',
        fuelType: 'gasoline',
        features: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeatureChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            features: checked
                ? [...prev.features, value]
                : prev.features.filter(feature => feature !== value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.model || !formData.year || !formData.mpg) {
            alert('Please fill in all required fields');
            return;
        }

        const carData = {
            model: formData.model,
            year: parseInt(formData.year),
            mpg: parseInt(formData.mpg),
            fuelType: formData.fuelType,
            features: formData.features
        };

        const success = await onAddCar(carData);
        if (success) {
            setFormData({
                model: '',
                year: '',
                mpg: '',
                fuelType: 'gasoline',
                features: []
            });

            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    };

    return (
        <div className="card">
            <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">
                    <i className="fas fa-plus-circle me-2"></i>Add New Car
                </h5>
            </div>
            <div className="card-body">
                <form id="addForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="model" className="form-label">Model *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Toyota Camry"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="year" className="form-label">Year *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="year"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                            min="1900"
                            max="2024"
                            placeholder="e.g., 2020"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="mpg" className="form-label">MPG *</label>
                        <input
                            type="number"
                            className="form-control"
                            id="mpg"
                            name="mpg"
                            value={formData.mpg}
                            onChange={handleChange}
                            required
                            min="1"
                            max="200"
                            placeholder="e.g., 30"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="fuelType" className="form-label">Fuel Type</label>
                        <select
                            className="form-select"
                            id="fuelType"
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

                    <div className="mb-3">
                        <label className="form-label">Features</label>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value="sunroof"
                                id="feature1"
                                onChange={handleFeatureChange}
                            />
                            <label className="form-check-label" htmlFor="feature1">Sunroof</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value="leather"
                                id="feature2"
                                onChange={handleFeatureChange}
                            />
                            <label className="form-check-label" htmlFor="feature2">Leather Seats</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value="navigation"
                                id="feature3"
                                onChange={handleFeatureChange}
                            />
                            <label className="form-check-label" htmlFor="feature3">Navigation</label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        <i className="fas fa-car me-2"></i>Add Car
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CarForm;