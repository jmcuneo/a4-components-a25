import React from 'react';

const Statistics = ({ cars }) => {
    const calculateStats = () => {
        if (cars.length === 0) {
            return {
                totalCars: 0,
                avgMpg: 0,
                avgAge: 0
            };
        }

        const totalCars = cars.length;
        const avgMpg = (cars.reduce((sum, car) => sum + car.mpg, 0) / totalCars).toFixed(1);
        const avgAge = (cars.reduce((sum, car) => sum + car.age, 0) / totalCars).toFixed(1);

        return {
            totalCars,
            avgMpg,
            avgAge
        };
    };

    const stats = calculateStats();

    return (
        <div className="card mt-4">
            <div className="card-header bg-info text-white">
                <h5 className="card-title mb-0">
                    <i className="fas fa-chart-bar me-2"></i>Statistics
                </h5>
            </div>
            <div className="card-body">
                <div id="stats" className="text-center">
                    <p>Total Cars: <span id="totalCars">{stats.totalCars}</span></p>
                    <p>Average MPG: <span id="avgMpg">{stats.avgMpg}</span></p>
                    <p>Average Age: <span id="avgAge">{stats.avgAge}</span> years</p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;