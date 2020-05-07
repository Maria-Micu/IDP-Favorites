const express = require('express')
var bodyParser = require('body-parser')
const axios = require("axios");
const mysql = require('mysql2')

const app = express()
const port = 5002

// Custom helpers
//const query = require('./query');

const SERVICE_NAME = "Favorites";

// Endpoints
const MONITORING_URL = "http://monitoring:5005/log";

var promisePool;

var jsonParser = bodyParser.json()

// Get favorites for guid
app.get('/favorites/:guid', jsonParser, async function (req, res) {
    postAsyncLog(`Fetch favorites data endpoind called with ${req.params.guid}`)

    const [favDetails, fields] = await promisePool.query(`SELECT * FROM fav where guid = '${req.params.guid}'`);
    postAsyncLog(`Favorites Results fetched: ${favDetails}`)

    res.json({ favDetails });
})

// Add to favorites with guid
app.post('/favorites/:guid', jsonParser, async function (req, res) {
    
    const item = req.body.item

    postAsyncLog(`Add to favorites ${req.params.guid} data endpoind called with item: ${item}`)

    const queryString = `INSERT INTO fav (guid, item) VALUES (${req.params.guid}, '${item}')`;
   
    await promisePool.query(queryString)
    postAsyncLog(`Product ${item} added to favorites ${req.params.guid}`)

    res.send('');
    
})

app.get('/', (req, res) => res.send('It works!'))

// Define http Method For generic use
const postAsyncLog = async message => {
    try {
        params = {
            service: SERVICE_NAME,
            timestamp: Date.now(),
            message: message,
        }

        const response = await axios.post(MONITORING_URL, params);
        if (response.status == 200) {
            console.log("Successfully sent to monitoring");
        }
    } catch (error) {
        console.log(error);
    }
};

// Start server and establish connection to db
app.listen(port, () => {

    console.log(`Example app listening at http://localhost:${port}`)
    console.log(`Establish connection to db...`)

    const pool = mysql.createPool({
        host: 'database',
        user: 'root',
        database: 'mycompanydb',
        password: 'admin',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // now get a Promise wrapped instance of that pool
    promisePool = pool.promise();
   
})