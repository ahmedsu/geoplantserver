// all user related routes
const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const cors = require('cors')

const corsOptions = {
    origin: '*'
}

const pool = mysql.createPool({
    //connectionLimit: 10,
    host: 'localhost',
    user:'root',
    password: '',
    database: 'visiotne_praksa'
})

function getConnection(){
    return pool;
}

const router = express.Router();


router.get("/totals", cors(corsOptions), (req, res) => {
       
    const connection = getConnection();
    const queryString = "SELECT COUNT(*) AS plantsTotal FROM PLANTS";
    const querySolved = "SELECT COUNT(*) AS plantsTotalSolved FROM PLANTS WHERE solved = true";
    const queryUnsolved = "SELECT COUNT(*) AS plantsTotalUnsolved FROM PLANTS WHERE solved = false";
    const queryLocations = "SELECT COUNT(*) AS locationsTotal FROM locations";
    const queryUsers = "SELECT COUNT(*) AS usersTotal FROM users";


    let totals = {};
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        totals = {
            'totalPlants': rows[0].plantsTotal
        }
    });
    connection.query(querySolved, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        totals["plantsTotalSolved"] = rows[0].plantsTotalSolved;
    });
    connection.query(queryUnsolved, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        totals["plantsTotalUnsolved"] = rows[0].plantsTotalUnsolved;
    });
    connection.query(queryLocations, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        totals["locationsTotal"] = rows[0].locationsTotal;
    });
    connection.query(queryUsers, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }
        totals["usersTotal"] = rows[0].usersTotal;
        res.json(totals);

    });

})


module.exports = router;