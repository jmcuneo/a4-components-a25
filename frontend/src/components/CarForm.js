import React, { useState } from 'react';

const CarForm = ({ onCarAdded, onShowAlert }) => {
    const [formData, setFormData] = useState({
        model: '',
        year: '',
        mpg: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.model || !formData.year || !formData.mpg) {
            onShowAlert('Please fill in all fields', 'danger');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setFormData({ model: '', year: '', mpg: '' });
                onShowAlert('Car added successfully! 🎉', 'success');
                onCarAdded();
            } else {
                onShowAlert('Error adding car: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error adding car:', error);
            onShowAlert('Error adding car. Please try again.', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
                <h4 className="mb-0 text-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Vehicle
                </h4>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-4">
                            <label htmlFor="model" className="form-label fw-semibold">
                                <i className="bi bi-tag me-1"></i>
                                Model
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="model"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="e.g., Toyota Camry"
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="year" className="form-label fw-semibold">
                                <i className="bi bi-calendar me-1"></i>
                                Year
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                min="1900"
                                max="2099"
                                placeholder="2024"
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="mpg" className="form-label fw-semibold">
                                <i className="bi bi-fuel-pump me-1"></i>
                                MPG
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="mpg"
                                name="mpg"
                                value={formData.mpg}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                placeholder="30.5"
                                required
                            />
                        </div>
                        <div className="col-md-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Add Car
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CarForm;