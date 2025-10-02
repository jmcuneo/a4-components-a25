import React, { useState, useEffect } from 'react';
import CarForm from './CarForm';
import CarTable from './CarTable';
import '../styles/App.css';

const CarInventory = ({ username, onLogout }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
    };

    const fetchCars = async () => {
        try {
            const response = await fetch('/api/cars', {
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success) {
                setCars(result.data);
            } else {
                showAlert('Error fetching cars: ' + result.message, 'danger');
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
            showAlert('Error fetching cars. Please try again.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleCarsUpdated = () => {
        fetchCars();
    };

    return (
        <div className="container-fluid p-4">
            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" onClick={() => setAlert({ show: false, message: '', type: '' })}></button>
                </div>
            )}

            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0 text-white">Car Inventory Management</h2>
                    <div>
                        <span className="mr-3 text-white">Welcome, {username}!</span>
                        <button
                            className="btn btn-outline"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>


            <CarForm onCarAdded={handleCarsUpdated} onShowAlert={showAlert} />

            {loading ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h5>Loading your car inventory...</h5>
                    </div>
                </div>
            ) : (
                <CarTable
                    cars={cars}
                    onCarsUpdated={handleCarsUpdated}
                    onShowAlert={showAlert}
                />
            )}
        </div>
    );
};

export default CarInventory;