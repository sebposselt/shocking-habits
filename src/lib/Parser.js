//function to give earthquakes a score on how much media attention they generate.
//input     : return object from seismic API, and 2d array of the earthquakes' articles.
//output    : array of scores.
//error     : if an error or exception happens. the earthquake triggering the error will recieve a score of -1.
//comment   : try/catch to make sure app doesn't crash in case of errors. 
exports.score = function (seismicAPIObj, articles_2d) {
    //default response is an array of -1. 
    let scoreArr = Array.from({ length: (seismicAPIObj.features).length }, () => -1);
    
    //for ease of eye..
    let obj = seismicAPIObj;
    
    for (let i = 0; i < (obj.features).length; i++) {
        try {
            let elm = obj.features[i];
            let articleArr = articles_2d[i];
            let score = 0;
            let target = String(elm.properties.mag)

            //catch if there are no articles for this quake. (an error related to async calls.) 
            if (articleArr === undefined){
                articleArr = [];
            }

            for (let j = 0; j < articleArr.length; j++) {
                //important to use indexOf instead of Search!!!
                if (articleArr[j].title && articleArr[j].title !== null) {
                    if ((articleArr[j].title).indexOf(target) !== -1) {
                        score++;
                        continue;
                    }
                }
                
                if (articleArr[j].description && articleArr[j].description !== null) {
                    if ((articleArr[j].description).indexOf(target) !== -1) {
                        score++;
                        continue;
                    }
                }
            }
            scoreArr[i] = score;
        } 
        catch (error) {
            console.log("Parser.js Error :", error);
            continue;
        }
    }
    return scoreArr;
}
