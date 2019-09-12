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

router.get("/bugs", cors(corsOptions), (req, res) => {
       
    const connection = getConnection();
    const queryString = "SELECT * FROM reportbug";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    })
})

router.get("/bugs/user/:userId", cors(corsOptions), (req, res) => {
    console.log("Fetching bugs for UserID: " + req.params.userId);
    const connection = getConnection();

    var userId = req.params.userId;
    var queryString = "SELECT * FROM reportbug WHERE userid = ?";
    connection.query(queryString, [userId], (err, rows, fields) => {
        if(err){
            console.log("Failed query! ", err);
            res.sendStatus(500);
            res.end();
            return;
        }
        console.log("Bugs");
        res.json(rows);
    });

});

router.get("/bug/:id", cors(corsOptions), (req, res) => {
    console.log("Fetching bug with ID: " + req.params.id);

    const connection = getConnection();

    var userId = req.params.id;
    var queryString = "SELECT * FROM reportbug WHERE id = ?";
    connection.query(queryString, [userId], (err, rows, fields) => {
        if(err){
            console.log("Failed query! ", err);
            res.sendStatus(500);
            res.end();
            return;
        }
        console.log("Bugs");
        res.json(rows);
    })
});

router.post('/bugs', cors(corsOptions), (req, res) => {
    const timestamp = req.body.timestamp;
    const userid = req.body.userid;
    const problem = req.body.problem;
    
    /*let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
    first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
db.query(query, (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }
    res.redirect('/');
});*/
    const queryString = "INSERT INTO `reportbug` (userid, problem, timestamp) VALUES (?, ?, ?)";
   
    console.log(queryString);
   /* getConnection().query(queryString, (err, result) => {
        console.log("USLO OVDJE");
        if(err){
            console.log("Proslo err");
            console.log(err);
            return res.status(500).send(err);
        }

        console.log("Plant is inserted! ", result.insertId);
        res.end();
    });*/
    getConnection().query(queryString, [userid, problem, timestamp], (err, results, fields) => {
        if(err){
            console.log("Failed to insert new bug!");
            console.log(err);
            res.sendStatus(500);
            return;
        }

        console.log("Bug is inserted!", results.insertId);
        res.status(200).end();
    });

});

module.exports = router;