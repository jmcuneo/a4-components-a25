import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001; // Use Render's port or 3001 for local

// Middleware to parse JSON bodies
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.resolve(__dirname, 'dist')));

// In-memory data store (replace with a database in a real application)
let appdata = [
    { id: 1, name: "Alex Chen", weight: 55, height: 1.75, bmi: 17.96, healthiness: "Underweight" },
    { id: 2, name: "Maria Garcia", weight: 67, height: 1.75, bmi: 21.88, healthiness: "Healthy Weight" },
    { id: 3, name: "David Smith", weight: 83, height: 1.75, bmi: 27.1, healthiness: "Overweight" },
    { id: 4, name: "Chris Jones", weight: 95, height: 1.75, bmi: 31.02, healthiness: "Obese" }
];
let nextId = 5;

const calculateBmi = (weight, height) => {
    const bmi = parseFloat((weight / (height * height)).toFixed(2));
    let healthiness = "Obese";
    if (bmi < 18.5) healthiness = "Underweight";
    else if (bmi < 25) healthiness = "Healthy Weight";
    else if (bmi < 30) healthiness = "Overweight";
    return { bmi, healthiness };
};

// API endpoint to get all patients
app.get('/api/patient', (req, res) => {
    res.json(appdata);
});

// API endpoint to add a new patient
app.post('/api/patient', (req, res) => {
    const { name, weight, height } = req.body;

    if (!name || !weight || !height) {
        return res.status(400).json({ error: 'Name, weight, and height are required.' });
    }

    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height);
    const { bmi, healthiness } = calculateBmi(weight, height);

    const newPatient = {
        id: nextId++,
        name,
        weight: weightKg,
        height: heightM,
        bmi,
        healthiness
    };

    appdata.push(newPatient);
    res.status(201).json(newPatient);
});

app.delete('/api/patient/:id', (req, res) => {
    const idToDelete = parseInt(req.params.id, 10);
    const initialLength = appdata.length;
    appdata = appdata.filter(patient => patient.id !== idToDelete);

    if (appdata.length < initialLength) {
        // Successfully deleted
        res.status(204).send(); // 204 No Content is a standard success response for DELETE
    } else {
        // Patient with the given ID was not found
        res.status(404).json({ error: 'Patient not found' });
    }
});

app.put('/api/patient/:id', (req, res) => {
    const patientId = parseInt(req.params.id, 10);
    const patientIndex = appdata.findIndex(p => p.id === patientId);

    if (patientIndex === -1) {
        return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = { ...appdata[patientIndex] }; // Create a copy to modify
    const { name, weight, height } = req.body;
    let needsRecalculation = false;

    if (name !== undefined) {
        patient.name = name;
    }
    if (weight !== undefined) {
        patient.weight = parseFloat(weight);
        needsRecalculation = true;
    }
    if (height !== undefined) {
        patient.height = parseFloat(height);
        needsRecalculation = true;
    }

    if(needsRecalculation) {
        const { bmi, healthiness } = calculateBmi(patient.weight, patient.height);
        patient.bmi = bmi;
        patient.healthiness = healthiness;
    }

    appdata[patientIndex] = patient; // Update the patient in the array
    res.status(200).json(patient); // Use 200 for successful update
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

