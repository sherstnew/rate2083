const express = require('express')
const sqlite3 = require('sqlite3')

const app = express()
const db = new sqlite3.Database('teachers.db')
let data = ''
let randid = 0
let sel = []

app.use(express.json())
app.use(express.static('public'))

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

db.serialize(async () => {
  sel = await query('SELECT * FROM teachers')
})

const teach = (req, res) => {
  data = req.body.query
  if (data == 'teachers') {
    
    randid = Math.floor(Math.random() * sel.length)
    console.log(sel, randid)

    if (sel.length === 0) {
      res.send('all')
    } else {
      res.send(sel[randid])
      sel.splice(randid, 1)
    }
  }
}

app.get('/', (req, res) => {
    res.sendFile('/home/runner/rate2083/public/pages/index.html')
})
app.post('/api', (req, res) => {
    teach(req, res)
})

app.listen(3000)
