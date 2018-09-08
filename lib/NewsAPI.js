const apiKey = "522210a2c60847bc8cbdd345f168a59b"
const request = require('request');
const dateTools = require('./DateTools');


exports.earthquakeArticles = function (quakeJsonObj) {
    let res = {};
    var keyWords = extractKeywords(quakeJsonObj.properties.flynn_region);
    
    //if the extractKeywords function returns with only "earthquake", an error has happened. 
    //Querying newAPI with only keyword "earthquake" will produce results 
    //that are impossible to determine if they are related to that specific earthquake or not.
    //therefore the weird danish string, to ensure no results and no manipulation with statistics.  
    if ((keyWords === "earthquake")) {
        res.q = "Sebastian Posselt er en dejlig mand med fantastisk hårpragt";
    }
    else {
        res.q = extractKeywords(quakeJsonObj.properties.flynn_region);
    }
    // get news from the day of the earthquake and two weeks forward
    res.from = quakeJsonObj.properties.time;
    res.to = dateTools.addDays(quakeJsonObj.properties.time,14);
    res.sortBy = 'relevancy';
    res.pageSize = 100;

    return res;
}


// construct query url form a parameter object.
exports.Qconst = function (obj) {
    const URLendpoint = "https://newsapi.org/v2/everything?";
    let res = "";

    //create query string and check to ensure properties exist and are not empty. Takes advantage of JS short circuit. 
    for (var i in tmp) {
        if (tmp.hasOwnProperty(i) && tmp[i] !== "") {
            res = res + "&" + String(i) + "=" + String(tmp[i]);
        }
    }
    res = res + "&page=1" + "&apiKey=" + apiKey;
    return URLendpoint + res;
}


//gets Articles from newsAPI, and returns an obj with; {'status', 'totalResults', 'articles[]'} 
// if error; status=error, totalResults=0,articles=empty 
exports.getArticles = async function (queryUrl) {
    let res = {
        status:"error", 
        totalResults:0, 
        articles:[]
    }; 
    let tmp = {};

    console.log("1 point");
    let urlObj = { url: queryUrl, json: true };
    await request(urlObj, function (error, response, body) {
        console.log("error: ",error);
        console.log("response: ",response.statusCode);
        console.log(body);
        console.log("iffy: ",(!error && response.statusCode === 200));
        if (!error && response.statusCode === 200) {
            tmp = body;
            //dev
            console.log("first itr")
        }
        else console.log("GetArticles Error: \n", error);
        return res;
    });


    //iterate through all pages of articles until no more articles left
    let pageCount = 1;
    while (tmp.status === "ok" && tmp.articles.length !== 0) {
        res.status = "ok";
        res.totalResults = tmp.totalResults;
        res.articles = res.articles.concat(tmp.articles);
        
        //get next page of articles
        var target = "&page=" + String(pageCount);
        var replacement = "&page=" + String(pageCount + 1);
        let urlObj = { url: queryUrl.replace(target,replacement), json: true };
        await request(urlObj, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                tmp = body;
            }
            else console.log("GetArticles Error: \n", error);
            return res;
        });
        pageCount++

        //development
        console.log("pageCount: ",pageCount);
    }
    console.log("hit return");
    return res;
}


// helper function to create a query string from "Flinn–Engdahl regions".
//input: Flinn–Engdahl region:string
//output: "keyword1+keyword2+keyword3..."
function extractKeywords (string) {
    //earthquake should always be a keyword
    var res = "earthquake";

    try {
        tmp = string.toLowerCase();
        tmp = tmp.replace(" region", "");
        tmp = tmp.split(",");

        for (let i = 0; i < tmp.length; i++) {
            tmp[i] = tmp[i].trim();
        }

        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].length !== 0 ) {
                res = res + "+" + tmp[i];
            }
        }
    return res;
    } 
    
    catch (error) {
        console.log("extractKeywords error :", error);

        //if the input is not passable, return default.
        return res;   
    }
}



// -------------------------- node.js module for newsAPI --------------------------
// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI("522210a2c60847bc8cbdd345f168a59b");


// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
// newsapi.v2.topHeadlines({
//   //sources: 'bbc-news,the-verge',
//   q: 'bitcoin',
//   category: 'business',
//   language: 'en',
//   country: 'us'
// }).then(response => {
//   console.log(response);
//   /*
//     {
//       status: "ok",
//       articles: [...]
//     }
//   */
// });
// To query /v2/everything
// You must include at least one q, source, or domain
// newsapi.v2.everything({
//   q: 'earthquake+bali+lombok',
//   // sources: 'bbc-news,the-verge',
//   // domains: 'bbc.co.uk, techcrunch.com',
//   from: '2018-08-05',
//   to: '2018-09-08',
//   // language: 'en',
//   sortBy: 'relevancy',
//   pageSize: 20,
//   page: 60
// }).then(response => {
//   console.log(response);

// });


