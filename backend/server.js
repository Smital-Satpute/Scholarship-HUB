const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;
36
// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint to handle form submission
app.post('/submit', (req, res) => {
    const { username, email, phone } = req.body;

    // Define the path for the Excel file
    const filePath = path.join(__dirname, '../database', 'login_data.xlsx');

    // Initialize workbook
    let workbook;

    // Check if the Excel file exists
    if (fs.existsSync(filePath)) {
        workbook = XLSX.readFile(filePath);
    } else {
        // Create a new workbook if file does not exist
        workbook = XLSX.utils.book_new();
    }

    const sheetName = 'Login Data';
    let sheetData = workbook.Sheets[sheetName] ? XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) : [];

    // Check for duplicates
    const exists = sheetData.some(row => row.username === username);

    console.log('Checking for duplicates...');
    console.log('Existing Data:', sheetData);
    console.log('New Entry:', { username, email, phone });
    console.log('Exists:', exists);

    if (!exists) {
        // If no duplicate, add new entry
        const newEntry = { username, email, phone };
        sheetData.push(newEntry);

        // Create a new sheet with updated data
        const newSheet = XLSX.utils.json_to_sheet(sheetData);

        // Clear the existing sheet and replace with the new one
        workbook.Sheets[sheetName] = newSheet;

        // Write back the updated workbook
        XLSX.writeFile(workbook, filePath);
        console.log('New entry added to the Excel sheet.');
    } else {
        console.log('Duplicate entry found. No new entry added.');
    }

    // Redirect to dashboard.html
    res.redirect('dashboard.html'); // Redirecting to dashboard.html in the frontend folder
});

// Serve index.html on root request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve static files like your HTML, CSS, and JS files
app.use(express.static(path.join(__dirname, 'frontend')));

// API route to fetch scholarship data from Excel
app.get('/api/scholarships', (req, res) => {
    const filePath = path.join(__dirname, '../database/Book1.xlsx');
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    res.json(jsonData);  // Send the Excel data as JSON
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
