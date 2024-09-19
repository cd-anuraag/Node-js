/*
  description: enum for response status
    usage : used in response handler lib
 */

const resStatusEnum = Object.freeze({
    SUCCESS: 200,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    INTERNAL_SERVER_ERROR: 500,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    UNAUTHORIZED: 401,
    GONE: 410,
})

module.exports = resStatusEnum

