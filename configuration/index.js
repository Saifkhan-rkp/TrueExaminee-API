const {localTime,shuffled_array} = require('./extraFunctions');
module.exports = {
    logger : require('./logger'),
    dbCon : require('./db'),
    email: require('./sendEmail'),
    shuffled_array: shuffled_array,
    localTime: localTime
}