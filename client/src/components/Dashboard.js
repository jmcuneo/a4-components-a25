import React, { useState, useEffect } from 'react';
import CarForm from './CarForm';
import CarTable from './CarTable';
import Statistics from './Statistics';

const Dashboard = ({ user, onLogout }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
            const response = await fetch('/api/cars', {
                credentials: 'include'
            });
            if (response.ok) {
                const carsData = await response.json();
                setCars(carsData);
            }
        } catch (error) {
            console.error('Error loading cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const addCar = async (carData) => {
        try {
            const response = await fetch('/api/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(carData),
            });

            if (response.ok) {
                loadCars();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error adding car:', error);
            return false;
        }
    };

    const updateCar = async (carId, updates) => {
        try {
            const response = await fetch(`/api/cars/${carId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                loadCars();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating car:', error);
            return false;
        }
    };

    const deleteCar = async (carId) => {
        try {
            const response = await fetch(`/api/cars/${carId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                loadCars();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting car:', error);
            return false;
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <i className="fas fa-car me-2"></i>Car Tracker
                    </a>
                    <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, <strong>{user?.username}</strong>!
            </span>
                        <button className="nav-link btn btn-link" onClick={onLogout}>
                            <i className="fas fa-sign-out-alt me-1"></i>Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-4">
                        <CarForm onAddCar={addCar} />
                        <Statistics cars={cars} />
                    </div>
                    <div className="col-lg-8">
                        <CarTable
                            cars={cars}
                            loading={loading}
                            onUpdateCar={updateCar}
                            onDeleteCar={deleteCar}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;