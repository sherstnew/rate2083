const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const serverless = require("serverless-http");

const app = express()
const router = express.Router()
const db = new sqlite3.Database('db/teachers.db')

const query = (command, method = 'all') => {
    return new Promise((resolve, reject) => {
      db[method](command, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


router.post('/handler', (req, res) => {
    data = req.body
    db.serialize(async () => {
        let sel = await query('SELECT * FROM teachers');
        res.send(sel)
      });
    res.send('ok');
})

app.use(express.json())
app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)
