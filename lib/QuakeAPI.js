const dateTools = require ("./DateTools");

//QuakeAPI.js

//TODO maybe implement as a function that return an object instead of obj Constructor.
//create object with the paramaters for a quary
exports.ParamConst = function(start,end,minmag,maxmag,limit){
    this.start = String(start),
    this.end = String(end),
    this.minmag = String(minmag),
    this.maxmag = String(maxmag)
    if (!limit || limit>100 ){
        this.limit = String(100);

    }
    else this.limit = String(limit);
}

//transfrom paramaters obj url
exports.Qconst = function(obj) {
    const URL = "http://www.seismicportal.eu/fdsnws/event/1/query?";
    var res = "";
    
    //check to ensure limit<100 to make site faster and avoid errors from the API
    if (!(obj.hasOwnProperty("limit")) || obj.limit > 100) {
        obj.limit = 100;
    }

    for (var i in obj) {
        if (obj.hasOwnProperty(i)){
            res = res + "&" + String(i) + "=" + String(obj[i]);
        }
    }
    res = URL + res + "&format=json";
    return res;
}

exports.default_query = function(){
    let res = new this.ParamConst(
        dateTools.getToday(),
        dateTools.getNextYear(),
        0.0, //minmax
        10,  //maxmag
        42   //limit
    );
    return this.Qconst(res);
}


exports.JsonToCoordArr = function(obj) {
    var res = []
    for (let i = 0; i < obj.features.length; i++) {
        var tmp = {};
        var elm = obj.features[i];
        tmp.coords = {lat:elm.properties.lat,lng:elm.properties.lon};
        tmp.content = "<p>" + String(elm.properties.mag)+ "</p>"
        
        res.push(tmp);
    }
    return res;
}