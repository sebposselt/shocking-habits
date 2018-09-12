const request = require('request');
const express = require('express');
const quakeAPI = require("../lib/QuakeAPI");
const apiKey = "7f6d6af01b654998bede1ea159f7f3b7"
const NewsAPI = require('newsapi');
const newsAPI = require("../lib/NewsAPI");
const newsapi = new NewsAPI(apiKey);
var bluebird = require("bluebird")
const router = express.Router();


function loopArticles (quake,articles,page) {
    quake.page = page;
    newsapi.v2.everything(quake)
        .then(response => {
            console.log("€€€€€€€€€€€€€€", page + 1000);
            //dev
            // console.log("in the then")
            // console.log("response:")
            // console.log(response)
            if (response.status !== "ok") {
                console.log("newsapi error: ", response)
                return [];
            }
            else if ((response.articles).length !== 0) {
                //dev
                console.log("##############Page################### : ", page);
                console.log("##############length################### : ", (response.articles).length);
                return loopArticles(quake, (articles.concat(response.articles)), ++page);
            }
            else return articles;
        });
}


/* GET home page. */
router.get('/', function (req, res, next) {
	let urlObj = { url: quakeAPI.default_query(), json: true }
	request(urlObj, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			//// dev
			var quakeJsonObjs = newsAPI.itr(body);
			return bluebird.map(quakeJsonObjs, (quake) => {
                return loopArticles(quake,[],1);
			}).then((articles) => {
				console.log("ATTENTION: ", articles.length);
				console.log("ATTENTION, ARTICLES AFTER MAP:");
				console.log(JSON.stringify(articles))
				/// 
				console.log(body.metadata.totalCount);
				res.render('index', {
					title: "Shocking Habits",
					quakes: JSON.stringify(quakeAPI.JsonToMarker(body, articles))
				});
			});
			//development
		}
		else {
			console.log("request error: ", error);
			res.render('error', { error });
		}
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
