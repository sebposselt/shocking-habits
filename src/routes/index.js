const request = require('request-promise');
const express = require('express');
const quakeAPI = require("../lib/QuakeAPI");
const global = require("../lib/Global");
const newsAPI = require("../lib/NewsAPI");
const parser = require("../lib/Parser");
const stats = require("../lib/Stats");
const apiKey = global.NEWSAPIKEY;
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(apiKey);
const router = express.Router();

//helper function
async function requestArticles(quake) {
	console.log("getting more quakes for", quake);
	return newsapi.v2.everything(quake);
}


/* GET home page. */
router.get('/', async function (req, res, next) {
	const quakeResult = await request({ url: quakeAPI.default_query(), json: true })
	const quakeJsonObjs = newsAPI.itr(quakeResult);
	let initialNewsRequests = quakeJsonObjs.map(obj => {
		obj.page = 1;
		return newsapi.v2.everything(obj)
	});
	
	let initialNewsResults = await Promise.all(initialNewsRequests);

	//variables to check fetching article process 
	let reqFinishedArr = Array.from({ length: initialNewsResults.length }, () => 0);
	let stopFlag = false;
	let index_lst = [];
	let bank = [];

	//loop through NewsAPI results, and see if all articles has been fetched.
	do {
		for (let i = 0; i < initialNewsResults.length; i++) {
			let elm = initialNewsResults[i];
			if (reqFinishedArr[i] === 0) {
				if (elm.totalResults === (elm.articles).length) {
					reqFinishedArr[i] = 1;
				}

				else {
					let nextPageParam = quakeJsonObjs[i]
					index_lst.push(i);
					//increment page no.
					++(nextPageParam.page)
					console.log("getting more pages for quake:", i);
					bank.push( requestArticles(nextPageParam));
				}
			}
		}
		let bankResults = await Promise.all(bank);

		
		for (let j = 0; j < index_lst.length; j++) {
			//dev. left in to see if a search requires more than 1 request articles pr. earthquake.
			console.log('Getting more articles');
			//
			inx = index_lst[j]
			initialNewsResults[inx].articles = (initialNewsResults[inx].articles).concat(bankResults[j].articles);			
		}

		index_lst = [];
		bank = [];
		let sum = reqFinishedArr.reduce(function (a, b) { return a + b; });
		stopFlag = (sum === initialNewsResults.length)
	} while (!stopFlag);

	// Working with the fetched data and sending results to client-side
	let scoreArr = parser.score(quakeResult,initialNewsResults);
	let renderQuakes = quakeAPI.JsonToMarker(quakeResult, scoreArr);
	let tmp = stats.getStats(quakeResult, scoreArr);
	res.render('index', {
		title: "Shocking Habits",
		quakes: JSON.stringify(renderQuakes),
		max: global.EARTHQUAKE_LIMIT,
		mystats: JSON.stringify(tmp)
	});
});



router.post("/", async function (req, res) {
	//parse what is posted to an obj
	let userQuery = {};
	for (let i = 0; i < Object.keys(req.body).length; i++) {
		let tmp = Object.keys(req.body)[i];
		if (req.body[tmp] !== '') {
			userQuery[tmp] = req.body[tmp]
		}
	}
	const quakeResult = await request({ url: quakeAPI.Qconst(userQuery), json: true })
	const quakeJsonObjs = newsAPI.itr(quakeResult);
	let initialNewsRequests = quakeJsonObjs.map(obj => {
		obj.page = 1;
		return newsapi.v2.everything(obj)
	});

	let initialNewsResults = await Promise.all(initialNewsRequests);

	//variables to check fetching article process 
	let reqFinishedArr = Array.from({ length: initialNewsResults.length }, () => 0);
	let stopFlag = false;
	let index_lst = [];
	let bank = [];

	//loop through NewsAPI results, and see if all articles has been fetched.
	do {
		for (let i = 0; i < initialNewsResults.length; i++) {
			let elm = initialNewsResults[i];
			if (reqFinishedArr[i] === 0) {
				if (elm.totalResults === (elm.articles).length) {
					reqFinishedArr[i] = 1;
				}

				else {
					let nextPageParam = quakeJsonObjs[i]
					index_lst.push(i);
					//increment page no.
					++(nextPageParam.page)
					console.log("getting more pages for quake:", i);
					bank.push(requestArticles(nextPageParam));
				}
			}
		}
		let bankResults = await Promise.all(bank);


		for (let j = 0; j < index_lst.length; j++) {
			//dev. left in to see if a search requires more than 1 request articles pr. earthquake.
			console.log('Getting more articles');
			//
			inx = index_lst[j]
			initialNewsResults[inx].articles = (initialNewsResults[inx].articles).concat(bankResults[j].articles);
		}

		index_lst = [];
		bank = [];
		let sum = reqFinishedArr.reduce(function (a, b) { return a + b; });
		stopFlag = (sum === initialNewsResults.length)
	} while (!stopFlag);

	// Working with the fetched data and sending results to client-side
	let scoreArr = parser.score(quakeResult, initialNewsResults);
	let renderQuakes = quakeAPI.JsonToMarker(quakeResult, scoreArr);
	let tmp = stats.getStats(quakeResult, scoreArr);
	res.render('index', {
		title: "Shocking Habits",
		quakes: JSON.stringify(renderQuakes),
		max: global.EARTHQUAKE_LIMIT,
		mystats: JSON.stringify(tmp)
	});
});

module.exports = router;

