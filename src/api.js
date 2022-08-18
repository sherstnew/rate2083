const express = require('express')
const serverless = require("serverless-http");
const axios = require('axios')

const app = express()
const router = express.Router()


router.post('/', (req, res) => {
    data = req.body
    axios.post('https://inv2083server.sherstnew.repl.co', {
      query: 'SELECT * FROM teachers',
    })
    .then(function (response) {
      res.send(response);
    })
    .catch(function (error) {
      console.log(error);
    });
})

app.use(express.json())
app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)
