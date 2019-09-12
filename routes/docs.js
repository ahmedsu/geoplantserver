// all user related routes
const express = require('express');

const router = express.Router();

router.get("/users", (req, res) => {
    console.log("Show docs...");
    res.end();
});

module.exports = router;