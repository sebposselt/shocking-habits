// const request = require('request');
// const fs = require("fs");


// const dateTools = require("./DateTools");
// const parser = require("./Parser");
// const newsAPI = require("./NewsAPI");
var quakeAPI = require("./QuakeAPI");
// const stats = require("./Stats");
// const global = require("./Global");

//copy/paste
// test("name", () => {

// });



// testing QuakeAPI
test("quakeAPI.ParamConst test 1", () => {
    var tmp = new quakeAPI.ParamConst(2018,2019,0,10,1000);
    expect(tmp.start).toBe(2018);
});
// fs.writeFile("./object.json", JSON.stringify(sampleObject), (err) => {
//     if (err) {
//         console.error(err);
//         return;
//     };
//     console.log("File has been created");
// });