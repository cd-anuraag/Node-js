/*
@author : numan
description : this file is used to send response to the user
/*
*/
const util = require("util")
const _ = require("lodash")
const resStatusEnum = require("../../enum/res.status.enum")

/**
 * @param res
 * @param data
 * @param error
 * @param {number} status
 */
async function sendResponse(res, data, error, status) {
    let responseToSend = {}
    try {
        if (_.isNil(status)) {
            throw new Error("Please provide status code ")
        }

        if (_.isEmpty(res)) {
            throw new Error("Please provide response object")
        }

        switch (status) {
            case resStatusEnum.SUCCESS:
                if (data === null || data === undefined || data.length === 0) {
                    throw new Error("Please provide data to send")
                }
                responseToSend = {
                    result: {
                        message: "Success",
                        data: data,
                        error: null,
                    },
                    status: resStatusEnum.SUCCESS,
                }
                break
            case resStatusEnum.VALIDATION_ERROR:
            {
                if (_.isNil(error)) {
                    throw new Error("Please provide error to send")
                }
                responseToSend = {
                    result: {
                        message: "Bad request",
                        data: data,
                        error: error,
                    },
                    status: resStatusEnum.VALIDATION_ERROR,
                }
            }
                break
            case resStatusEnum.NOT_FOUND:
            {
                if (_.isNil(error)) {
                    throw new Error("Please provide error to send")
                }
                responseToSend = {
                    result: {
                        message: "Resource Not Found",
                        data: data,
                        error: error,
                    },
                    status: resStatusEnum.NOT_FOUND,
                }
            }
                break
            case resStatusEnum.INTERNAL_SERVER_ERROR:
            {
                responseToSend = {
                    result: {
                        message: "Internal Server Error",
                        data: data,
                        error: util.inspect(error),
                    },
                    status: resStatusEnum.INTERNAL_SERVER_ERROR,
                }
            }
                break
            case resStatusEnum.UNAUTHORIZED:
            {
                responseToSend = {
                    result: {
                        message: "Unauthorized",
                        data: data,
                        error: error,
                    },
                    status: resStatusEnum.UNAUTHORIZED,
                }
            }
                break
            case resStatusEnum.TOO_MANY_REQUESTS:
            {
                responseToSend = {
                    result: {
                        message: "Too many requests",
                        data: data,
                        error: error,
                    },
                    status: resStatusEnum.TOO_MANY_REQUESTS,
                }
            }
                break
            case resStatusEnum.CONFLICT:
            {
                responseToSend = {
                    result: {
                        message: "Conflict",
                        data: data,
                        error: error,
                    },
                    status: resStatusEnum.CONFLICT,
                }
            }
                break
            case resStatusEnum.ACCEPTED:
            {
                responseToSend = {
                    result: {
                        message: "ACCEPTED",
                        data: data,
                        error: null,
                    },
                    status: resStatusEnum.ACCEPTED,
                }
            }
                break
            case resStatusEnum.GONE:
            {
                responseToSend = {
                    result: {
                        message: "Gone",
                        data: data,
                        error: error,
                    },
                    status: resStatusEnum.GONE,
                }
            }
                break
            case resStatusEnum.NO_CONTENT:
            {
                responseToSend = {
                    result: {
                        message: "No Content",
                        data: data,
                        error: error,
                    },
                    status: resStatusEnum.NO_CONTENT,
                }
            }
                break
            default: {
                throw new Error("Invalid status code")
            }
        }


        res.json(responseToSend)
    } catch (error) {
        throw error
    }
}

module.exports = {
    sendResponse: sendResponse,
}
