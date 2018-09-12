
//takes as input a QuakeArticlesCont object from NewsAPI.js and a magnitude. Return number of articles that include the magnitude in either title or description.
//returns -1 if error
exports.score = function (articlesArr, magnitude) {
    try {
        let target = String(magnitude)
        let score = 0;
    
        for (let i = 0; i < articlesArr.length; i++) {
            if (articlesArr[i].hasOwnProperty("title") && articlesArr[i].title !== null){
                if ((articlesArr[i].title).search(target) !== -1 ){
                    score++
                    continue;
                }
            }
            if (articlesArr[i].hasOwnProperty("description") && articlesArr[i].description !== null){
                if ((articlesArr[i].description).search(target) !== -1 ){
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
