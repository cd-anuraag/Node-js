const _ = require("lodash")
const jwt = require("jsonwebtoken")
const responseLib = require("../lib/handler/handler.response.lib")
const resStatusEnum = require("../enum/res.status.enum")

async function verifyToken(req, res, next) {
    try {
        if (_.isEmpty(req.headers.authorization)) {
            return responseLib.sendResponse(
                res,
                null,
                "headers empty",
                resStatusEnum.UNAUTHORIZED,
            )
        }
        let token = req.headers.authorization.split(" ")[1]
        if (_.isNil(token)) {
            return responseLib.sendResponse(
                res,
                null,
                "token empty",
                resStatusEnum.UNAUTHORIZED,
            )
        }

        let user = jwt.verify(token, "test")
        req.userId = user.userId
        next()
    } catch (e) {
        return responseLib.sendResponse(
            res,
            null,
            e,
            resStatusEnum.INTERNAL_SERVER_ERROR
        )
    }
}

module.exports = {verifyToken: verifyToken}
