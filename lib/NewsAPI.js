const apiKey = "7f6d6af01b654998bede1ea159f7f3b7"
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(apiKey);
const dateTools = require('./DateTools');

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

exports.QuakeArticlesCont = function (earthquakeParamObj){
    this.articlesTotal = 0;
    this.articles = [];
    this.earthquakeParamObj = earthquakeParamObj;

    // function to fetch articles
    this.getArticles = function(page) {
        let pageNumber = page;
        let quake = this.earthquakeParamObj;
        quake.page = pageNumber;

        
        //dev
        console.log(quake.page);
        console.log(quake);
        
        newsapi.v2.everything(quake)
            .then(response => {
                //dev
                console.log("in the then")

                if (response.status !== "ok") {
                    console.log("newsapi error: ", response)
                }

                if ((response.articles).length !== 0) {
                    //dev
                    console.log("##############length################### : ", (response.articles).length);
                    this.articlesTotal = response.totalResults;
                    this.articles = (this.articles).concat(response.articles);
                    this.getArticles(++pageNumber);
                }
            }); //close then  
    } //close getArticles
} // close object







// const apiKey = "7f6d6af01b654998bede1ea159f7f3b7"
// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI(apiKey);
// const request = require('request');
// const dateTools = require('./DateTools');

// // helper function to create a query string from "Flinn–Engdahl regions".
// //input: Flinn–Engdahl region:string
// //output: "keyword1+keyword2+keyword3..."
// function extractKeywords (string) {
//     //earthquake should always be a keyword
//     let res = "earthquake";
//     try {
//         let tmp = string.toLowerCase();
//         tmp = tmp.replace(" region", "");
//         tmp = tmp.split(",");

//         for (let i = 0; i < tmp.length; i++) {
//             tmp[i] = tmp[i].trim();
//         }

//         for (let i = 0; i < tmp.length; i++) {
//             if (tmp[i].length !== 0 ) {
//                 res = res + "+" + tmp[i];
//             }
//         }
//         return res;
//     }          
//     catch (error) {
//         console.log("extractKeywords error :", error);
//         //if the input is not passable, return default.
//         return res;   
//     }
// }


// // constructs parameter object for querying the api
// function paramConst (quakeJsonObj) {
//     let res = {};
//     let keyWords = extractKeywords(quakeJsonObj.properties.flynn_region);

//     //if the extractKeywords function returns with only "earthquake", an error has happened. 
//     //Querying newAPI with only keyword "earthquake" will produce results 
//     //that are impossible to determine if they are related to that specific earthquake or not.
//     //therefore the weird danish string, to ensure no results and no manipulation with statistics.  
//     if ((keyWords === "earthquake")) {
//         res.q = "Sebastian Posselt er en dejlig mand med fantastisk hårpragt";
//     }
//     else {
//         res.q = extractKeywords(quakeJsonObj.properties.flynn_region);
//     }
//     // get news from the day of the earthquake and two weeks forward
//     res.from = quakeJsonObj.properties.time;
//     res.to = dateTools.addDays(quakeJsonObj.properties.time,14);
//     res.sortBy = 'relevancy';
//     res.pageSize = 100;
//     return res;
// }







// // just for development testing...
// // exports.itr = function (payload) {
// //     for (let i = 0; i < payload.features.length; i++) {
// //         let elm = payload.features[i];
// //         elm = this.paramConst(elm);
// //         elm = this.Qconst(elm);  
// //     }
// // }


// // construct query url form a parameter object.
// //input: parameter object
// //output: query string
// exports.Qconst = function (obj) {
//     const URLendpoint = "https://newsapi.org/v2/everything?";
//     let res = "";

//     //create query string and check to ensure properties exist and are not empty. Takes advantage of JS short circuit. 
//     for (var i in obj) {
//         if (obj.hasOwnProperty(i) && obj[i] !== "") {
//             res = res + "&" + String(i) + "=" + String(obj[i]);
//         }
//     }
//     res = res + "&apiKey=" + apiKey;
//     return URLendpoint + res;
// }

// //TODO remove console.logs
// //gets Articles from newsAPI.
// //input: query URL
// //output: an obj with; {'status', 'totalResults', 'articles[]'} 
// // if error; status=error, totalResults=0,articles=empty 
// exports.getArticles = async function (queryUrl) {
//     let res = {
//         status:"error", 
//         totalResults:0, 
//         articles:[]
//     }; 
//     let tmp = {};
//     //dev
//     console.log("first checkpoint");
//     let urlObj = { url: queryUrl, json: true };
//     await request(urlObj, function (error, response, body) {
//         //dev
//         console.log("error: ",error);
//         console.log("response: ",response.statusCode);
//         console.log(body);
//         console.log("iffy: ",(!error && response.statusCode === 200));
//         if (!error && response.statusCode === 200) {
//             tmp = body;
//             //dev
//             console.log("first itr")
//         }
//         else console.log("GetArticles Error: \n", error);
//         return res;
//     });


//     //iterate through all pages of articles until no more articles left
//     let pageCount = 1;
//     while (tmp.status === "ok" && tmp.articles.length !== 0) {
//         res.status = "ok";
//         res.totalResults = tmp.totalResults;
//         res.articles = res.articles.concat(tmp.articles);
        
//         //get next page of articles
//         var target = "&page=" + String(pageCount);
//         var replacement = "&page=" + String(pageCount + 1);
//         let urlObj = { url: queryUrl.replace(target,replacement), json: true };
//         await request(urlObj, function (error, response, body) {
//             if (!error && response.statusCode === 200) {
//                 tmp = body;
//             }
//             else console.log("GetArticles Error: \n", error);
//             return res;
//         });
//         pageCount++

//         //development
//         console.log("pageCount: ",pageCount);
//     }
//     console.log("hit return");
//     return res;
// }



