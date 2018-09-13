const parser = require("./Parser")




exports.getStats = function (seismicAPIObj,scoreArr) {
    let res = "<p>";
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
        var elm = tmp[Object.keys(tmp)[i]];
        len = elm.length;
        //get sum of the array and divide by length to get average.
        elm = (elm.reduce(function (a, b) { return a + b; })/len);
        res = res + "<b>" + Object.keys(tmp)[i] + ": </b>" + elm + "<br><br>";
    }
    //dev
    //console.log(res + "</p>");
    return (res + "</p>");
}


// helper function to get country from "Flinn–Engdahl regions".
//input: Flinn–Engdahl region:string
//output: "country if any"
function getCountry (string) {
    try {
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
