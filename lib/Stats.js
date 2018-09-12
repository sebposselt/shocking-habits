const parser = require("./Parser")




function getStats(quakeJsonObj) {
    let res = "";
    let country = getCountry(quakeJsonObj.properties.flynn_region);
    let score;
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
