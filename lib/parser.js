
//takes as input a QuakeArticlesCont object from NewsAPI.js and a magnitude. Return number of articles that include the magnitude in either title or description.
//returns -1 if error
exports.score = function (articleArr, magnitude) {
    try {
        let target = String(magnitude)
        let score = 0;
    
        for (let i = 0; i < articleArr.length; i++) {
            if (articleArr[i].title && articleArr[i].title !== null){
                if ((articleArr[i].title).search(target) !== -1 ){
                    score++
                    continue;
                }
            }
            if (articleArr[i].description && articleArr[i].description !== null){
                if ((articleArr[i].description).search(target) !== -1 ){
                    score++
                    continue;
                }
            }
        }
        return score;
    } catch (error) {
        console.log("Parser.js Error :", error);
        return -1
    }
}
