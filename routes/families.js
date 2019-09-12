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

router.get("/plantfamilies", cors(corsOptions), (req, res) => {
       
    const connection = getConnection();
    const queryString = "SELECT * FROM plantfamilies";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    })
})

router.get("/plantfamily/:id", (req, res) => {
    console.log("Fetching plant with ID: " + req.params.id);

    const connection = getConnection();

    var plantId = req.params.id;
    var queryString = "SELECT * FROM plantfamilies WHERE id = ?";
    connection.query(queryString, [plantId], (err, rows, fields) => {
        if(err){
            console.log("Failed query! ", err);
            res.sendStatus(500);
            res.end();
            return;
        }
        console.log("Plant");
        res.json(rows);
    })
});

router.get("/plantfamilies/plants/:familyId", cors(corsOptions), (req, res) => {
    console.log("Fetching plants for Plant family ID: " + req.params.familyId);
    const connection = getConnection();

    var familyId = req.params.familyId;
    var queryString = "SELECT * FROM `plants` WHERE family = ?";
    connection.query(queryString, [familyId], (err, rows, fields) => {
        console.log(queryString);
        if(err){
            console.log("Failed query! ", err);
            res.sendStatus(500);
            res.end();
            return;
        }
        console.log("Plants");
        let arrItems = rows;
        arrItems.forEach(element => {
            element.image = "http://192.168.43.87:3003/uploadimg/"+element.image;
        });
        console.log(arrItems);
        res.json(arrItems);
    });

});

router.post('/plantfamilies', (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    
    /*let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
    first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
db.query(query, (err, result) => {
    if (err) {
        return res.status(500).send(err);
    }
    res.redirect('/');
});*/
    const queryString = "INSERT INTO `plantfamilies` (name, image) VALUES (?, ?)";
   
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
    getConnection().query(queryString, [name, image], (err, results, fields) => {
        if(err){
            console.log("Failed to insert new family!");
            console.log(err);
            res.sendStatus(500);
            return;
        }

        console.log("Plant is inserted!", results.insertId);
        res.end();
    });

});

router.get("/families/count", cors(corsOptions), (req, res) => {
       
    const connection = getConnection();
    const queryString = "select count * from families";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }

        res.json(arrItems);
    })
})

module.exports = router;