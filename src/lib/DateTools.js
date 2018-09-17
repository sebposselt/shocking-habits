
// credit of https://stackoverflow.com/questions/563406/add-days-to-javascript-date
// edited return to get a YYYY-MM-DD type string, and not the UTC TMI string Date.toString() gives.
exports.addDays = function (date, days) {
    var today = new Date(date);
    today.setDate(today.getDate() + days);
    //note the getUTCMonth() +1... this is due to f&#! js, 0-indexing their months.. #Can'tFailATestifThereIsNoTest
    return (String(today.getUTCFullYear()) + "-" + String(today.getUTCMonth() + 1) + "-" + String(today.getUTCDate()));
}

//return current date in the form YYYY-MM-DD
exports.getToday = function (){
    today = new Date();
    //note the getUTCMonth() +1... this is due to f&#! js, 0-indexing their months.. #Can'tFailATestifThereIsNoTest
    return (String(today.getUTCFullYear()) +"-" + String(today.getUTCMonth()) +"-" + String(today.getUTCDate()));
}

exports.getNextYear = function (){
    today = new Date();
    return String(today.getFullYear() + 1);
}

