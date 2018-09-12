const dateTools = require('./DateTools');
const global = require("./Global");
const apiKey = global.NEWSAPIKEY;
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(apiKey);

//just for development testing...
exports.itr = function (payload) {
    let returnArr = [];
    for (let i = 0; i < (payload.features).length; i++) {
        let elm = payload.features[i];
        let tmp = paramConst(elm);
        returnArr.push(tmp);
    }
    return returnArr;
}


// helper function to create a query string from "Flinn–Engdahl regions".
//input: Flinn–Engdahl region:string
//output: "keyword1+keyword2+keyword3..."
function extractKeywords (string) {
    //earthquake should always be a keyword
    let res = "earthquake";
    try {
        let tmp = string.toLowerCase();
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

// helper function to get country from "Flinn–Engdahl regions".
//input: Flinn–Engdahl region:string
//output: "country if any"
exports.getCountry = function (string) {
    try {
        res = "UNKNOWN"; //default
        let tmp = string.toLowerCase();
        tmp = tmp.replace(" region", "");
        tmp = tmp.split(",");
        // trim whitespace
        for (let i = 0; i < tmp.length; i++) {
            tmp[i] = tmp[i].trim();
        }
        if (tmp.length === 1) {
            res = tmp[tmp.length - 1];
        }
        return res;
    }
    catch (error) {
        console.log("getCountry error :", error);
        //if the input is not passable, return default.
        return res.toUpperCase();
    }
}


// constructs parameter object for querying the api
function paramConst (quakeJsonObj) {
    let res = {};
    let keyWords = extractKeywords(quakeJsonObj.properties.flynn_region);

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

// not in use
// exports.QuakeArticlesCont = function (earthquakeParamObj){
//     this.articlesTotal = 0;
//     this.articles = [];
//     this.earthquakeParamObj = earthquakeParamObj;

//     // function to fetch articles
//     this.getArticles = function(page) {
//         let pageNumber = page;
//         let quake = this.earthquakeParamObj;
//         quake.page = pageNumber;

        
//         //dev
//         console.log(quake.page);
//         console.log(quake);
        
//         newsapi.v2.everything(quake)
//             .then(response => {
//                 //dev
//                 console.log("in the then")

//                 if (response.status !== "ok") {
//                     console.log("newsapi error: ", response)
//                 }

//                 if ((response.articles).length !== 0) {
//                     //dev
//                     console.log("##############length################### : ", (response.articles).length);
//                     this.articlesTotal = response.totalResults;
//                     this.articles = (this.articles).concat(response.articles);
//                     this.getArticles(++pageNumber);
//                 }
//             }); //close then  
//     } //close getArticles
// } // close object