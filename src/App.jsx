import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from '@ag-grid-community/theming';
import AddPatientForm from './components/AddPatientForm';
import DeleteButton from "./components/DeleteButton.jsx";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
function App() {
    const [rowData, setRowData] = useState([]); // Start with empty data

    // Column Definitions
    // Function to fetch data from the server
    const fetchPatients = async () => {
        try {
            const response = await fetch('/api/patient');
            const data = await response.json();
            setRowData(data);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        }
    };

    const [colDefs] = useState([
        { field: 'id', hide: true},
        { field: 'name', filter: true, flex: 1, editable: true},
        { field: 'weight', flex: 1, editable: true },
        { field: 'height', flex: 1, editable: true },
        { field: 'bmi', flex: 1 },
        { field: 'healthiness', headerName: 'Status', flex: 1 },
        { headerName: 'Action',
            // Use the custom renderer component for this column
            cellRenderer: DeleteButton,
            // Pass the fetchPatients function to the renderer
            cellRendererParams: {
                onDelete: fetchPatients
            },
            flex: 1,
        }
    ]);

    const onCellEditRequest = useCallback(async (event) => {
        console.log("cell edit request")
        const { data, colDef, newValue } = event;
        const patientId = data.id;
        const field = colDef.field
        const updatePayload = { [field]: newValue };

        try {
            const response = await fetch(`/api/patient/${patientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
                throw new Error('Failed to update patient');
            }

            // On success, refresh the grid data
            fetchPatients();

        } catch (error) {
            console.error("Update failed:", error);
        }

    }, [fetchPatients])


    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        fetchPatients();

    }, []); // The empty array ensures this runs only once on mount

    return (
        <div style={{padding: 30}} className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">BMI Tracker</h1>

            <div className="ag-theme-quartz" style={{ height: 51 + 42 * rowData.length, width: 1010 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    theme={themeQuartz}
                    onCellEditRequest={onCellEditRequest}
                    readOnlyEdit={true}
                />
            </div>

            {/* Add the form component below the grid, passing the fetch function as a prop */}
            <AddPatientForm onPatientAdded={fetchPatients} />
        </div>
    );
}

export default App;

