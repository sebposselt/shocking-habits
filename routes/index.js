const request = require('request');
const express = require('express');
const quakeAPI = require("../quake/QuakeAPI");
const newsAPI = require("../news/NewsAPI");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let urlObj = { url:quakeAPI.default_query(), json: true }
    request(urlObj, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.render('index', { 
                title: "Shocking Habits", 
                quakes: JSON.stringify(quakeAPI.JsonToCoordArr(body)) 
            });
            //development
            console.log(body.metadata.totalCount);
        }
        else res.render('error', { error });
    });
});

router.post("/", function (req, res) {    
    //parse what is posted to an obj
    let userQuery = {};
    for (let i = 0; i < Object.keys(req.body).length; i++) {
        let tmp = Object.keys(req.body)[i];
        if (req.body[tmp] !== '') {
            userQuery[tmp] = req.body[tmp]
        }
    }

    let urlObj = { url: quakeAPI.Qconst(userQuery), json: true };
    request(urlObj, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.render('index', { title: "Shocking Habits", quakes: JSON.stringify(quakeAPI.JsonToCoordArr(body)) });
            //development
            console.log(body.metadata.totalCount);
        }
        else res.render('error', { error }); 
    });
});

module.exports = router;