
//takes as input a QuakeArticlesCont object from NewsAPI.js and a magnitude. Return number of articles that include the magnitude in either title or description.
//returns -1 if error
exports.score = function (seismicAPIObj, articles_2d) {
    let scoreArr = Array.from({ length: (seismicAPIObj.features).length }, () => -1);
    let obj = seismicAPIObj;
    
    for (let i = 0; i < (obj.features).length; i++) {
        try {
            let elm = obj.features[i];
            let articleArr = articles_2d[i];
            let score = 0;
            let target = String(elm.properties.mag)

            //catch if there are no articles for this quake 
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