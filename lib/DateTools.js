
// credit of https://stackoverflow.com/questions/563406/add-days-to-javascript-date
exports.addDays = function (date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return String(result);
}

//return current date in the form YYYY-MM-DD
exports.getToday = function (){
    today = new Date();
    return (String(today.getFullYear()) +"-" + String(today.getMonth()) +"-" + String(today.getDate()));
}

exports.getNextYear = function (){
    today = new Date();
    return String(today.getFullYear() + 1);
}