/**
 * @param {string} value
 * @return {boolean}
 */
function isString(value) {
    if (typeof value !== "string") {
        return false
    }
    return true
}


/**
 * @param {string} value
 * @param regex
 * @return {boolean}
 */
function matches(value, regex) {
    return isString(value) && regex.test(value)
}

/**
 * @param value
 * @return {boolean}
 */
function isEmail(value) {
    return matches(value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
}

module.exports = {
    //isString: isString,
    //matches: matches,
    isEmail: isEmail
}
