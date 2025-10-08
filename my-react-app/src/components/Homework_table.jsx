import React from "react";

export default function Homework_table({homework}) {

    return (
        <div className="card p-4 mb-4">
            <h2 className="h5 mb-3">Your Assignments</h2>
            <div className="table-responsive-xl shadow-lg">

                <table className="table table-striped table-hover" id="homework-table">

                    <thead>
                    <tr className="table-primary text-uppercase">
                        <th scope="col">ID</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Hours Expected</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Stress Score</th>
                    </tr>
                    </thead>

                    <tbody>

                    {homework.map(homework => (
                        <tr key = {homework.ID}>
                            <td>{homework.ID}</td> <td>{homework.subject}</td> <td>{homework.expectedtime}</td>
                            <td>{new Date(homework.date).toLocaleDateString()}</td>
                            <td>{homework.stress_score}</td>
                        </tr>)
                    )}

                    </tbody>

                </table>
            </div>
        </div>
    );

}


