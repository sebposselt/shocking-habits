const request = require('request-promise');
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
const async = require("async");

/* GET home page. */
router.get('/', async function (req, res, next) {
	const quakeResult = await request({ url: quakeAPI.default_query(), json: true })
	// console.log(JSON.stringify(quakeResult, null, 2));
	
	const quakeJsonObjs = newsAPI.itr(quakeResult);
	let initialNewsRequests = quakeJsonObjs.map(obj => {
		obj.page = 1;
		return newsapi.v2.everything(obj)
	});
	let initialNewsResults = await Promise.all(initialNewsRequests);
	let reqFinishedArr = Array.from({ length: initialNewsResults.length }, () => 0);
	let stopFlag = false;

	//loop through NewsAPI results, and if all articles has been fetched.
	do {
		console.log("loopy");
		for (let i = 0; i < initialNewsResults.length; i++) {
			let elm = initialNewsResults[i];
			if (reqFinishedArr[i] === 0) {
				if (elm.totalResults === (elm.articles).length) {
					reqFinishedArr[i] = 1;
				}

				else {
					let nextPageParam = quakeJsonObjs[i]
					//increment page no.
					++(nextPageParam.page)
					console.log("getting more pages for quake:", i);
					tmp = loopyThing(nextPageParam);
					initialNewsResults[i] = (initialNewsResults[i].articles).concat(tmp);
					console.log('length of article array:', initialNewsResults[i].length);

				}
			}
		}
		let sum = reqFinishedArr.reduce(function (a, b) { return a + b; });
		stopFlag = (sum === initialNewsResults.length)
	} while (!stopFlag);
	

	console.log("Have i finished?", stopFlag);
	



	//console.log(initialNewsResults);

	// const initialResult = await newsapi.v2.everything(quakeJsonObjs[0])
	// console.log(JSON.stringify(initialResult, null, 2));


	// let urlObj = { url: quakeAPI.default_query(), json: true }
	// request(urlObj, function (error, response, body) {
	// 	if (!error && response.statusCode === 200) {
            
    //         //return array of parameter objects used to query the newsAPI
    //         var quakeJsonObjs = newsAPI.itr(body);
	// 		return bluebird.map(quakeJsonObjs, (quake) => {
	// 			loopyThing(quake);
	// 		}).then((articles) => {
    //             //dev
    //             //console.log("ATTENTION: ", articles.length);
	// 			//console.log("ATTENTION, ARTICLES AFTER MAP:");
	// 			//console.log(JSON.stringify(articles))
				
	// 			console.log(body.metadata.totalCount);
	// 			let scoreArr = parser.score(body,articles);
	// 			let renderQuakes = quakeAPI.JsonToMarker(body, scoreArr);
	// 			let tmp = stats.getStats(body, scoreArr);
	// 			res.render('index', {
	// 				title: "Shocking Habits",
	// 				quakes: JSON.stringify(renderQuakes),
	// 				max: global.EARTHQUAKE_LIMIT,
	// 				mystats: JSON.stringify(tmp)
	// 			});
	// 		});
	// 	}
	// 	else {
	// 		console.log("request error: ", error);
	// 		res.render('error', { error });
	// 	}
	// });
});


async function loopyThing(quake) {
	console.log("getting more quakes for", quake);
	res = await newsapi.v2.everything(quake);
	return res.articles;
}



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

