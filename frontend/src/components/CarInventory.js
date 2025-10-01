import React, { useState, useEffect } from 'react';
import CarForm from './CarForm';
import CarTable from './CarTable';

const CarInventory = ({ username, onLogout }) => {
    const [cars, setCars] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [stats, setStats] = useState({ total: 0, averageMPG: 0, newest: 0, oldest: 0 });

    useEffect(() => {
        loadCars();
    }, []);

    useEffect(() => {
        calculateStats();
    }, [cars]);

    const calculateStats = () => {
        if (cars.length === 0) {
            setStats({ total: 0, averageMPG: 0, newest: 0, oldest: 0 });
            return;
        }

        const total = cars.length;
        const averageMPG = (cars.reduce((sum, car) => sum + car.mpg, 0) / total).toFixed(1);
        const newest = Math.max(...cars.map(car => car.year));
        const oldest = Math.min(...cars.map(car => car.year));

        setStats({ total, averageMPG, newest, oldest });
    };

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 5000);
    };

    const loadCars = async () => {
        try {
            const response = await fetch('/api/cars');

            if (!response.ok) {
                throw new Error('Failed to fetch cars');
            }

            const result = await response.json();

            if (result.success) {
                setCars(result.data);
            } else {
                showAlert('Error loading cars: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error loading cars:', error);
            showAlert('Error loading cars. Please try again.', 'danger');
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        onLogout();
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
                <div className="container">
                    <a className="navbar-brand d-flex align-items-center fw-bold" href="#">
                        <i className="bi bi-car-front fs-3 me-2"></i>
                        Car Inventory
                    </a>
                    <div className="navbar-nav ms-auto d-flex flex-row align-items-center">
                        <span className="navbar-text me-4 d-none d-md-block">
                            <i className="bi bi-person-circle me-2"></i>
                            Welcome, <strong>{username}</strong>!
                        </span>
                        <a className="nav-link btn btn-outline-light btn-sm" href="/logout" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-1"></i>
                            Logout
                        </a>
                    </div>
                </div>
            </nav>

            {/* Stats Cards */}
            <div className="container mt-4">
                <div className="row g-3 mb-4">
                    <div className="col-md-3 col-6">
                        <div className="card bg-primary text-white h-100 shadow">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <h6 className="card-title mb-0 opacity-75">Total Cars</h6>
                                        <h3 className="mb-0 fw-bold">{stats.total}</h3>
                                    </div>
                                    <i className="bi bi-car-front fs-2 opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card bg-success text-white h-100 shadow">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <h6 className="card-title mb-0 opacity-75">Avg MPG</h6>
                                        <h3 className="mb-0 fw-bold">{stats.averageMPG}</h3>
                                    </div>
                                    <i className="bi bi-speedometer2 fs-2 opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card bg-info text-white h-100 shadow">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <h6 className="card-title mb-0 opacity-75">Newest</h6>
                                        <h3 className="mb-0 fw-bold">{stats.newest || '-'}</h3>
                                    </div>
                                    <i className="bi bi-arrow-up-circle fs-2 opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-6">
                        <div className="card bg-warning text-white h-100 shadow">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <h6 className="card-title mb-0 opacity-75">Oldest</h6>
                                        <h3 className="mb-0 fw-bold">{stats.oldest || '-'}</h3>
                                    </div>
                                    <i className="bi bi-arrow-down-circle fs-2 opacity-75"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert */}
                {alert.show && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show shadow`}>
                        <div className="d-flex align-items-center">
                            <i className={`bi ${
                                alert.type === 'success' ? 'bi-check-circle-fill' :
                                    alert.type === 'danger' ? 'bi-exclamation-triangle-fill' :
                                        'bi-info-circle-fill'
                            } me-2`}></i>
                            <span>{alert.message}</span>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setAlert({ show: false, message: '', type: '' })}
                        ></button>
                    </div>
                )}

                {/* Main Content */}
                <div className="row">
                    <div className="col-12">
                        <CarForm
                            onCarAdded={loadCars}
                            onShowAlert={showAlert}
                        />
                        <CarTable
                            cars={cars}
                            onCarsUpdated={loadCars}
                            onShowAlert={showAlert}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white mt-5 py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h6 className="mb-0">
                                <i className="bi bi-car-front me-2"></i>
                                Car Inventory Management
                            </h6>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <small className="text-muted">
                                &copy; 2024 All rights reserved
                            </small>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CarInventory;