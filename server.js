const express = require('express')
const sqlite3 = require('sqlite3')

const app = express()
let data = ''
let randid = 0
let sel = []
let db

app.use(express.json())
app.use(express.static('public'))

// routes

app.get('/', (req, res) => {
    res.sendFile('/home/runner/rate2083/public/pages/index.html')
})
app.post('/api', (req, res) => {
    q = req.body.q
    if (q == 'teachers') {
        db = new sqlite3.Database('teachers.db')
        db.serialize(async () => {
          sel = await query('SELECT * FROM teachers')
        })
        db.close()
        res.send(sel)
    } else if (q == 'like') {
        db = new sqlite3.Database('teachers.db')
        let name = req.body.name
        let likes = req.body.likes
        db.serialize(() => {
            let update = 'UPDATE teachers SET likes=' + likes + ' WHERE name="' + name + '"'
            db.run(update)
            
        })
        db.close()
        res.send('ok')
    }
})

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


app.listen()