// server to handle ajax requests to mockapi.io
const express = require('express');
const app = express();
const axios = require('axios');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '10.211.55.20',
    user: 'mysuer',
    password: 'password',
    database: 'doctor_dppointment'
});

app.use(express.json());

app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', "DELETE, POST, GET, PUT, OPTIONS");

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', '*');

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Get - Fetch all users
app.get('/api/users', (req, res) => {
    console.log('GET /api/users');
    let query = 'SELECT * from patients';

    pool.query(query, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

// Post - Add user
app.post('/api/users/', (req, res) => {
    console.log('POST /api/users');
    let patient = req.body;
    let insertQuery = 'INSERT INTO patients (name, age, gender, status, time, date, phone, doctor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    let value = [patient.name, patient.age, patient.gender, patient.status, patient.time, patient.date, patient.phone, patient.doctor];
    let query = mysql.format(insertQuery, value);

    pool.query(query, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        // rows fetch
        console.log(data);
    });
});

// Put - Update user
app.put('/api/users/:id', (req, res) => {
    console.log('PUT /api/users/' + req.params.id);
    let patient = req.body;
    delete patient.id;
    let columns = Object.keys(patient);
    let values = Object.values(patient);
    let updateQuery = "UPDATE patients SET " + columns.join(" = ?, ") + " = ? WHERE id = ?";
    values.push(req.params.id);
    let query = mysql.format(updateQuery, values);

    pool.query(query, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }
        // rows updated
        console.log(response.affectedRows);
    });
});

// Delete - Delete user
app.delete('/api/users/:id', (req, res) => {
    console.log('DELETE /api/users/' + req.params.id);
    let deleteQuery = "DELETE from patients where id = ?";
    let query = mysql.format(deleteQuery, [req.params.id]);
    
    pool.query(query, (err, response) => {
        if (err) {
            console.error(err);
            return;
        }
        // rows deleted
        console.log(response.affectedRows);
    });
});

app.listen(3001, () => {
    console.log('listening on port 3001');
});
