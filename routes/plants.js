// all user related routes
const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const cors = require('cors')
const database = require('../database');

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

router.get("/plants", cors(corsOptions), async (req, res) => {
       
    const connection = getConnection();
    const queryString = "SELECT * FROM plants";
    query(queryString)
    .then((rows) => {
        let arrItems = rows;
        let ended = false;
        console.log("DUZINA: ", arrItems.length);
        arrItems.forEach((element,index) => {
            console.log("INDEX: ", index);
            element.image = "http://192.168.43.87:3003/uploadimg/"+element.image;
            query(`SELECT CONCAT(firstname,' ', lastname) AS imeprezime FROM users WHERE id = ${element.autor}`)
            .then((rowsname) => {
                console.log("ROWS");
                console.log(rowsname[0].imeprezime);
                let name = rowsname[0].imeprezime;
                element.autorInfo = {
                    id: element.autor,
                    imeprezime: name
                }
                delete element.autor;
                if(index == arrItems.length-1){
                    res.json(rows);
                }  
            })   
                 
          
        });
       
    })

})

router.get("/plant/:id",cors(corsOptions), async (req, res) => {
    console.log("Fetching plant with ID: " + req.params.id);

    var userId = req.params.id;
    var queryString = "SELECT * FROM plants WHERE id = ?";

    query(queryString, [userId])
    .then((rows) => {
        console.log("ISPIS");
        console.log(rows);

        let arrItems = rows;
        arrItems.forEach(element => {
            element.image = "http://192.168.43.87:3003/uploadimg/"+element.image;
        });

        res.json(arrItems);
    })
    .catch((err) => console.log(err));

});

/* SEARCH PLANT */

router.get('/plants/search/:q', cors(corsOptions), (req, res) => {
    const connection = getConnection();
    var queryString = 'SELECT * FROM plants WHERE name LIKE "%'+req.params.q+'%" OR latName LIKE "%'+req.params.q+'%"';

    query(queryString)
    .then((rows) => {
        let arrItems = rows;
        arrItems.forEach(element => {
            element.image = "http://192.168.43.87:3003/uploadimg/"+element.image;
        });

        res.json(rows);
    })

});

/*
* POST Plant
*/
router.post('/plants', cors(corsOptions), (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const latName = req.body.latName;
    const family = req.body.family;
    const kingdom = req.body.kingdom;
    const plantOrder = req.body.plantOrder;
    const about = req.body.about;
    const geoLat = req.body.geoLat;
    const geoLon = req.body.geoLon;
    const type = req.body.type;
    const solved = parseInt(req.body.solved);
    const autor = req.body.autor;

    console.log("TIP: ", type);
    if(!req.files)
        return res.status(400).send("Nema odabrane slike!");

    var file = req.files.uploaded_image;
    var img_name=file.name;

    console.log(file);
    console.log(file.name);

    if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
        file.mv('public/uploadimg/'+file.name, function(err) {
                       
            if (err)
              return res.status(500).send(err);

            const queryString = "INSERT INTO `plants` (name, latName, family, kingdom, plantOrder, about, geoLat, geoLon, image, solved, type, autor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            console.log("USLO");
            console.log(name + " -  " + latName + " - " + family + " - " + kingdom + " - " + plantOrder + " - " + about + " - " + geoLat + " - " + geoLon + " - " + img_name + " - " + type + " - " + solved + " - " + autor);
            
           
            console.log(queryString);
            getConnection().query(queryString, [name, latName, family, kingdom, plantOrder, about, geoLat, geoLon, img_name, solved, type, autor], (err, results, fields) => {
                if(err){
                    console.log("Failed to insert new plant!");
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
        
                console.log("Plant is inserted!", results.insertId);
               // res.end();
                res.redirect('http://192.168.43.87:3000/plants/plantsList');
            });

            });
    } else {
      message = "Ovaj format nije dozvoljen, molimo vas da postavite sliku u nekom od sljedećih formata '.png','.gif','.jpg'";
      res.render('index.ejs',{message: message});
    }



});

module.exports = router;