require("dotenv").config({path: "../.env"})
const cors = require("cors")
const path = require("path")
const express = require('express');
const app = express();

const mongoLib = require("../lib/database/database.mongo.lib")
const responseLib = require("../lib/handler/handler.response.lib")

const authRoutes = require("./routes/auth.routes")
const productRoutes = require("./routes/product.routes")
const quotationRoutes = require("./routes/quotation.routes")

const resStatusEnum = require("../enum/res.status.enum")

const PORT = process.env.PORT || 3000;

;(async () => {
    try {
        await mongoLib.connect(process.env.MONGO_URL)

        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use(cors())
        app.use("/auth", authRoutes)
        app.use("/product", productRoutes)
        app.use("/quotation", quotationRoutes)

        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, '../index.html'));
        })

        app.get("/status", (req, res) => {
            return responseLib.sendResponse(
                res,
                {health: "GREEN"},
                null,
                resStatusEnum.SUCCESS,
            )
        })

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
})()
