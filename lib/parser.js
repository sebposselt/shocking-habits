
//takes as input a QuakeArticlesCont object from NewsAPI.js and a magnitude. Return number of articles that include the magnitude in either title or description.
//returns -1 if error
exports.parser = function (obj, magnitude) {
    try {
        let target = String(magnitude)
        let score = 0;
    
        for (let i = 0; i < (obj.articles).length; i++) {
            if (obj.articles[i].hasOwnProperty("title") && obj.articles[i].title !== null){
                if ((obj.articles[i].title).search(target) !== -1 ){
                    score++
                    continue;
                }
            }
            if (obj.articles[i].hasOwnProperty("description") && obj.articles[i].description !== null){
                if ((obj.articles[i].description).search(target) !== -1 ){
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
