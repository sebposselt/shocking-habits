const dateTools = require('./DateTools');

// iterator to create parameter objects for querying.
exports.itr = function (seismicAPIObj) {
    let returnArr = [];
    for (let i = 0; i < (seismicAPIObj.features).length; i++) {
        let elm = seismicAPIObj.features[i];
        let tmp = ParamConst(elm);
        returnArr.push(tmp);
    }
    return returnArr;
}

// helper function to create a query string from "Flinn–Engdahl regions".
//input: Flinn–Engdahl region:string
//output: "keyword1+keyword2+keyword3..."
//comment: try/catch and default to ensure the app doesn't crash on error
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
        //if the input is not parse-able, return default.
        return res;
    }
}

// constructs parameter object for querying the api
function ParamConst (quakeJsonObj) {
    let res = {};
    let keyWords = extractKeywords(quakeJsonObj.properties.flynn_region);
    //if the extractKeywords function returns with only "earthquake", an error has happened. 
    //Querying newAPI with only keyword "earthquake" will produce results 
    //that are impossible to determine if they are related to that specific earthquake or not.
    //therefore the weird danish string, to ensure no resulting articles and no manipulation with statistics.  
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