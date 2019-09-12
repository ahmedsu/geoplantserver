// all user related routes
const express = require('express');
const mysql = require('mysql');
var bcrypt = require('bcrypt');
const cors = require('cors')

const corsOptions = {
    origin: '*'
}

var saltRounds = 10;


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

function query( sql, args ) {
    const connection = getConnection();
    return new Promise( ( resolve, reject ) => {
        connection.query( sql, args, ( err, rows ) => {
            if ( err )
                return reject( err );
            resolve( rows );
        } );
    } );
}

const router = express.Router();

router.get("/users", (req, res) => {
       
    const connection = getConnection();
    const queryString = "SELECT * FROM users";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }

        res.json(rows);
    })
})

router.get("/user/:id", (req, res) => {
    console.log("Fetching user with ID: " + req.params.id);

    const connection = getConnection();

    var userId = req.params.id;
    var queryString = "SELECT * FROM users WHERE id = ?";
    connection.query(queryString, [userId], (err, rows, fields) => {
        if(err){
            console.log("Failed query! ", err);
            res.sendStatus(500);
            res.end();
            return;
        }
        console.log("Users");
        res.json(rows);
    })
});

router.put("/user/:id", (req, res) => {
    console.log("Change user data: ", req.params.id);
    const connection = getConnection();

    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const dob = req.body.dob;
    const title = req.body.title;
    const location = req.body.location;
    const email = req.body.email;
    const phone = req.body.phone;

    var userId = req.params.id;
    var queryString = "UPDATE users SET firstname = ?, lastname = ?, dob = ?, title = ?, location = ?, email = ?, phone = ? WHERE id = ?";
    connection.query(queryString, [firstName, lastName, dob, title, location, email, phone, userId], (err, rows, fields) => {
        if(err){
            if(err.code == 'ER_DUP_ENTRY'){
                console.log("User already exist!");
                res.status(403).send("User already exist!");
                return;
            } else{
                console.log("Failed to insert new user!");
                res.sendStatus(500);
                return;
            }
        }
        console.log("User");
        res.json(rows);
    });
})

router.post('/users', (req, res) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const dob = req.body.dob;
    const title = req.body.title;
    const location = req.body.location;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;
    console.log(req.body);
    bcrypt.hash(password, saltRounds, (err, hash) => {
        const queryString = "INSERT INTO users (firstname, lastname, dob, title, location, email, password, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        getConnection().query(queryString, [firstName, lastName, dob, title, location, email, hash, phone], (err, results, fields) => {
            if(err){
                console.log(err);
                if(err.code == 'ER_DUP_ENTRY'){
                    console.log("User already exist!");
                    res.status(403).send("User already exist!");
                    return;
                } else{
                    console.log("Failed to insert new user!");
                    res.sendStatus(500);
                    return;
                }

            }

            console.log("User is inserted!", results.insertId);
            res.status(200).send("Success!");
        });
    })


});

router.post("/users/signIn", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);

    let queryString = `SELECT * FROM users WHERE email="${email}"`;
    console.log(queryString);
    
    getConnection().query(queryString, (err, results, fields) => {
        if(err){
            console.log("Cannot find user!");
            res.sendStatus(500);
            return;
        }

        console.log("User found!");
        console.log("PW: ", password);
        console.log(results);
        if(results.length > 0){
            bcrypt.compare(password, results[0].password, (err, result) => {
                if(result == true){
                    let user = results[0];
                    res.json(user);
                } else {
                    res.json({"message": "Password is incorrect!"});
                }
            })
        } else {
            res.json({"message": "User not found!"});
        }
      
    })
})


router.get("/users/count", cors(corsOptions), (req, res) => {
       
    const connection = getConnection();
    const queryString = "select count * from users";
    connection.query(queryString, (err, rows, fields) => {
        if(err){
            res.sendStatus(500);
            return;
        }

        res.json(arrItems);
    })
})

module.exports = router;