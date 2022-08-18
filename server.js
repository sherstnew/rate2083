const express = require('express')
const sqlite3 = require('sqlite3')

const app = express()
const db = new sqlite3.Database('teachers.db')

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

app.get('/', (req, res) => {
    res.sendFile('/home/runner/rate2083/public/pages/index.html')
})
app.post('/api', (req, res) => {
    db.serialize(async () => {
      let sel = await query('SELECT * FROM teachers');
      res.send(sel)
    });
})

app.use(express.json())
app.use(express.static('public'))
app.listen(3000)
