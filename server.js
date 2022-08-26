const { Sequelize, QueryTypes } = require('sequelize');
const express = require('express')
const cors = require('cors')

const app = express()
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'teachers.db'
});
let sel = []

app.use(express.json())
app.use(express.static('public'))
app.use(cors({
    origin: 'https://2083.ga'
}));

// routes

app.get('/', (req, res) => {
    res.sendFile('/home/runner/rate2083/public/pages/index.html')
})
app.get('/rating', (req, res) => {
    res.sendFile('/home/runner/rate2083/public/pages/rating.html')
})
app.post('/api', (req, res) => {
    if (req.header('origin') != undefined) {
      try {
        q = req.body.q
        if (q == 'teachers') {
            getTeachers(res)
        } else if (q == 'like') {
            let name = req.body.name
            let likes = req.body.likes
            let update = 'UPDATE teachers SET likes=' + likes + ' WHERE name = "' + name + '"'
            sequelize.query(update, {logging: false});
            res.send('ok')
        } else if (q == 'rating') {
            sortTeachers(res)
        } else if (q == 'search') {
            let select = 'SELECT * FROM teachers WHERE name LIKE "%' + req.body.sq + '%"'
            searchTeacher(res, select)
        }
      } catch (err) {
        res.send('error')
        console.log(err)
      }
    } else {
      res.send('access denied :)')
    }
})

const getTeachers = async (res) => {
    sel = await sequelize.query("SELECT * FROM teachers", { type: QueryTypes.SELECT, logging: false })
    res.send(JSON.stringify(sel));
}
const sortTeachers = async (res) => {
    sel = await sequelize.query("SELECT * FROM teachers ORDER BY likes DESC LIMIT 10", { type: QueryTypes.SELECT, logging: false })
    res.send(JSON.stringify(sel));
}
const searchTeacher = async (res, select) => {
    sel = await sequelize.query(select, { type: QueryTypes.SELECT, logging: false })
    res.send(JSON.stringify(sel));
}
app.listen(2083)