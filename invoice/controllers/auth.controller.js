const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const _ = require("lodash")
const config = require("../../config")

const responseLib = require("../../lib/handler/handler.response.lib")
const mongoLib = require("../../lib/database/database.mongo.lib")

const validatorUtil = require("../../util/validator.util")
const userModel = require("../models/user.model")

const resStatusEnum = require("../../enum/res.status.enum")

async function register(req, res) {
    try {
        const {name, email, password} = req.body

        if (_.isEmpty(name) || _.isEmpty(email) || _.isEmpty(password)) {
            return responseLib.sendResponse(res, null, "Name, email and password are required", resStatusEnum.VALIDATION_ERROR,)
        }
        if (!validatorUtil.isEmail(email)) {
            return responseLib.sendResponse(res, {
                message: "Invalid email",
            }, null, resStatusEnum.VALIDATION_ERROR)
        }

        let user = await mongoLib.findOneByQuery(userModel, {email: email})
        if (user) {
            return responseLib.sendResponse(res, null
                , "user exists", resStatusEnum.VALIDATION_ERROR)
        }

        const encryptedPassword = await bcrypt.hash(password, config.saltRounds)
        user = await mongoLib.createDoc(userModel, {
            name: name, email: email, password: encryptedPassword,
        })

        return responseLib.sendResponse(res, {
            message: "User created successfully", user: user,
        }, null, resStatusEnum.SUCCESS)


    } catch (error) {
        //log the error
        return responseLib.sendResponse(res, null, error, resStatusEnum.INTERNAL_SERVER_ERROR,)
    }
}

async function login(req, res) {
    try {
        const {email, password} = req.body

        if (_.isEmpty(email) || _.isEmpty(password)) {
            return responseLib.sendResponse(res, null, "Email and password are required", resStatusEnum.VALIDATION_ERROR,)
        }
        if (!validatorUtil.isEmail(email)) {
            return responseLib.sendResponse(res, {
                message: "Invalid email",
            }, null, resStatusEnum.VALIDATION_ERROR)
        }

        let user = await mongoLib.findOneByQuery(userModel, {email: email})
        if (!user) {
            return responseLib.sendResponse(res, null, "User not found", resStatusEnum.NOT_FOUND,)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return responseLib.sendResponse(res, null, "Invalid password", resStatusEnum.VALIDATION_ERROR,)
        }

        const token = jwt.sign({userId: user._id}, "test") //env

        return responseLib.sendResponse(res, {
            message: "User logged in successfully", token: token,
        }, null, resStatusEnum.SUCCESS)

    } catch (error) {
        return responseLib.sendResponse(res, null, error, resStatusEnum.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    register: register, login: login,
}
