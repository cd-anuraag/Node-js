const mongoose = require("mongoose")
const _ = require("lodash")

/**
 * @param {string} url
 */
async function connect(url) {
    try {
        if (_.isEmpty(url)) {
            throw new Error("No URL provided")
        }
        mongoose.set("strictQuery", false)
        await mongoose.connect(url)
        console.log("Connected to mongodb")
    } catch (error) {
        throw error
    }
}

/**
 * Disconnect from mongodb
 */
async function disconnect() {
    try {
        await mongoose.disconnect()
        console.log("Disconnected from mongodb")
    } catch (error) {
        throw error
    }
}

/**
 * @param model
 * @param query
 * @returns {Promise<*>}
 */
async function findOneByQuery(model, query) {
    try {
        if (_.isEmpty(model) || _.isEmpty(query)) {
            throw new Error(`Model or query is empty Model:${model} Query: ${query}`)
        }
        return await model.findOne(query)

    } catch (error) {
        throw error
    }
}

/**
 * @param model
 * @param object
 * @returns {Promise<*>}
 */
async function createDoc(model, object) {
    try {
        if (_.isEmpty(model) || _.isEmpty(object)) {
            throw new Error(`Model or object is empty Model:${model} Object: ${object}`)
        }
        return await model.create(object)
    } catch (error) {
        throw error
    }
}

/**
 * @param model
 * @param query
 * @returns {Promise<*>}
 */
async function findByQuery(model, query) {
    try {
        if (_.isEmpty(model) || _.isEmpty(query)) {
            throw new Error(`Model or query is empty Model:${model} Query: ${query}`)
        }
        return await model.find(query)

    } catch (error) {
        throw error
    }
}

async function findByQueryWithSelect(model, query, selectedFields) {
    try {
        if (_.isEmpty(model) || _.isEmpty(query)) {
            throw new Error(`Model or query is empty Model:${model} Query: ${query}`)
        }
        return await model.find(query).select(selectedFields)

    } catch (error) {
        throw error
    }
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    findOneByQuery: findOneByQuery,
    createDoc: createDoc,
    findByQuery: findByQuery,
    findByQueryWithSelect: findByQueryWithSelect,
}
