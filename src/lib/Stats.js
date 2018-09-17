const parser = require("./Parser")

// a function to get average media attention of a country/region.
//input: the return JSON obj from the seismicAPI, and an array of scores for each of those earthquakes
//output: HTML string with results.
exports.getStats = function (seismicAPIObj,scoreArr) {
    let res = "";
    let tmp = {};
    for (let i = 0; i < (seismicAPIObj.features).length; i++) {
        let elm = seismicAPIObj.features[i];
        let score = scoreArr[i];
        let country = getCountry(elm.properties.flynn_region);
        // if (country === "UNKNOWN") {
        //     country = elm.properties.flynn_region;
        // }
        if (tmp[country]) {
            (tmp[country]).push(score);
        }
        else {
            tmp[country] = [score];
        }
    }
    for (let i = 0; i < Object.keys(tmp).length; i++) {
        let elm = tmp[Object.keys(tmp)[i]];
        len = elm.length;
        //get sum of the array and divide by length to get average.
        elm = (elm.reduce(function (a, b) { return a + b; })/len);
        res = res + "<b>" + Object.keys(tmp)[i] + ": </b>" + elm + "<br><br>";
    }
    //dev
    //console.log(res + "</p>");
    return (res );
}


// helper function to get country from "Flinn–Engdahl regions".
//input: Flinn–Engdahl region:string
//output: "country if any || region"
function getCountry (string) {
    try {
        //default case to make sure app/service doesn't crash on unexpected input/output.
        res = "UNKNOWN"; //default
        let tmp = string.toLowerCase();
        tmp = tmp.replace(" region", "");
        tmp = tmp.split(",");
        // trim whitespace
        for (let i = 0; i < tmp.length; i++) {
            tmp[i] = tmp[i].trim();
        }
        
        if (tmp.length > 1) {
            return (tmp[tmp.length - 1]).toUpperCase();
        }
        else if (tmp.length === 1){
            return tmp[0].toUpperCase()
        }
        else return res;
        
    } catch (error) {
        console.log("getCountry error :", error);
        //if the input is not passable, return default.
        return res.toUpperCase();
    }
}
