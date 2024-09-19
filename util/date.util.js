/**
 * @return {number}
 */

function getCurrentTimestampInMs() {
    return new Date().getTime()
}

module.exports = {
    getCurrentTimestampInMs: getCurrentTimestampInMs
}
