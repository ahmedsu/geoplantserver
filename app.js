const express = require('express');
const app = express();
const cors = require('cors')
const morgan = require('morgan');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');

const bodyParser = require('body-parser');

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

app.use(bodyParser.json());

app.use(express.static('./public'));

//app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use(morgan('short'));

//HEADERS
//allow OPTIONS on all resources
app.options('*', cors())

// END OF HEADERS

//ROUTES

app.get("/", (req, res) => {
    res.send("Success");
});

const routerUsers = require('./routes/user.js');
const routerPlants = require('./routes/plants.js');
const routerBugs = require('./routes/bugs.js');
const routerDocs = require('./routes/docs.js');
const routerTotals = require('./routes/totals.js');
const routerPlantFamilies = require('./routes/families.js');


app.use(routerUsers);
app.use(routerPlants);
app.use(routerBugs);
app.use(routerPlantFamilies);
app.use(routerTotals);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', routerDocs);

app.listen(3003, () => {
    console.log("Server is up and listening on 3003...");
});