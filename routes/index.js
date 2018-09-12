const request = require('request');
const express = require('express');
const quakeAPI = require("../lib/QuakeAPI");
const newsAPI = require("../lib/NewsAPI");
const global = require("../lib/Global");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    let urlObj = { url:quakeAPI.default_query(), json: true }
    request(urlObj, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            //// dev
            let newsArticles = newsAPI.itr(body);
            console.log("ATTENTION: ",newsArticles.length);
            for (let i = 0; i < newsArticles.length; i++) {
                const elem = newsArticles[i];
                console.log((elem.articles).length);
                console.log(global.DATA_READY)
            }
            /// 
            res.render('index', { 
                title: "Shocking Habits", 
                quakes: JSON.stringify(quakeAPI.JsonToMarker(body)) 
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