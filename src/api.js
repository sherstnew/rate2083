const express = require('express')
const serverless = require("serverless-http");

const app = express()
const router = express.Router()

router.get('/', (req, res) => {
    res.send('hi!')
})

app.use(express.json())
app.use('/', router)

module.exports.handler = serverless(app)