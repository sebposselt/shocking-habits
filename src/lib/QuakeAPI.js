const dateTools = require("./DateTools");
const global = require("./Global");

//create object with the paramaters for a quary
exports.ParamConst = function (start, end, minmag, maxmag, limit) 
{
    this.start = String(start),
    this.end = String(end),        
    this.minmag = String(minmag),
    this.maxmag = String(maxmag)
    this.limit = limit;
}

//transform parameters obj query url
exports.Qconst = function (obj) {
    const URL = "http://www.seismicportal.eu/fdsnws/event/1/query?";
    var res = "";

    //check to ensure limit<global.EARTHQUAKE_LIMIT to make site faster, avoid errors from the API, and limit requests.
    if (!(obj.hasOwnProperty("limit")) || obj.limit > global.EARTHQUAKE_LIMIT) {
        obj.limit = global.EARTHQUAKE_LIMIT;
    }

    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            res = res + "&" + String(i) + "=" + String(obj[i]);
        }
    }
    res = URL + res + "&format=json";
    return res;
}

exports.default_query = function () {
    let res = new this.ParamConst(
        dateTools.getToday(),
        dateTools.getNextYear(),
        5.0, //minmax
        10,  //maxmag
        global.EARTHQUAKE_LIMIT   //limit
    );
    return this.Qconst(res);
}

//make array of objects that can be handled by the Google Maps API to place markers and infoWindows.
exports.JsonToMarker = function (obj, scoreArr) {
    var res = []
    for (let i = 0; i < obj.features.length; i++) {
        let tmp = {};
        let elm = obj.features[i];
        let mag = elm.properties.mag;
        let score = scoreArr[i]
        
        tmp.coords = { lat: elm.properties.lat, lng: elm.properties.lon };
        tmp.content = "<p>"; //begin html
        tmp.content = tmp.content +  "Magnitude: " +  String(mag) + "<br>";
        tmp.content = tmp.content +  "Date: " +  String(elm.properties.time) + "<br>"; 

        tmp.content = tmp.content + "Score: " + score;
        tmp.content = tmp.content + "</p>"
        res.push(tmp);
    }
    return res;
}

