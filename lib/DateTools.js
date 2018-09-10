
// credit of https://stackoverflow.com/questions/563406/add-days-to-javascript-date
exports.addDays = function (date, days) {
    var today = new Date(date);
    today.setDate(today.getDate() + days);
    return (String(today.getUTCFullYear()) +"-" + String(today.getUTCMonth()) +"-" + String(today.getUTCDate()));
}

//return current date in the form YYYY-MM-DD
exports.getToday = function (){
    today = new Date();
    return (String(today.getUTCFullYear()) +"-" + String(today.getUTCMonth()) +"-" + String(today.getUTCDate()));
}

exports.getNextYear = function (){
    today = new Date();
    return String(today.getFullYear() + 1);
}

