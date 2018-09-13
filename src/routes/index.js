const request = require('request');
const express = require('express');
const bluebird = require("bluebird")
const quakeAPI = require("../lib/QuakeAPI");
const global = require("../lib/Global");
const newsAPI = require("../lib/NewsAPI");
const parser = require("../lib/Parser");
const stats = require("../lib/Stats");
const apiKey = global.NEWSAPIKEY;
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(apiKey);
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	let urlObj = { url: quakeAPI.default_query(), json: true }
	request(urlObj, function (error, response, body) {
		if (!error && response.statusCode === 200) {
            
            //return array of parameter objects used to query the newsAPI
            var quakeJsonObjs = newsAPI.itr(body);
			return bluebird.map(quakeJsonObjs, (quake) => {
				quake.page = 1;
				//console.log("in the each with quake:", quake);
				return newsapi.v2.everything(quake)
					.then(response => {
						//dev
						//console.log("in the then")
						// console.log("response:")
                        // console.log(response)
                        //
						if (response.status !== "ok") {
							console.log("newsapi error: ", response)
						}
						if ((response.articles).length !== 0) {
							//dev
							console.log("##############length################### : ", (response.articles).length);
                            //
							return response.articles;
						}
					});
			}).then((articles) => {
                //dev
                //console.log("ATTENTION: ", articles.length);
				//console.log("ATTENTION, ARTICLES AFTER MAP:");
				//console.log(JSON.stringify(articles))
				console.log(body.metadata.totalCount);
				let scoreArr = parser.score(body,articles);
				let renderQuakes = quakeAPI.JsonToMarker(body, scoreArr);
				let tmp = stats.getStats(body, scoreArr);
				console.log(tmp);
				res.render('index', {
					title: "Shocking Habits",
					quakes: JSON.stringify(renderQuakes),
					max: global.EARTHQUAKE_LIMIT,
					mystats: tmp
				});
			});
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
            //TODO fix this line!!!
			res.render('index', {
				title: "Shocking Habits", 
				quakes: JSON.stringify(quakeAPI.JsonToMarker (body,[])),
				max: global.EARTHQUAKE_LIMIT });
			//development
			console.log(body.metadata.totalCount);
		}
		else res.render('error', { error });
	});
});

module.exports = router;

