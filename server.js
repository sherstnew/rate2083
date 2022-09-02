const { Sequelize, QueryTypes } = require('sequelize');
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

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
app.use(cookieParser())

// routes

app.get('/', (req, res) => {
  res.sendFile('/home/runner/rate2083/public/pages/index.html')
})
app.get('/rating', (req, res) => {
  res.sendFile('/home/runner/rate2083/public/pages/rating.html')
})
app.post('/api', (req, res) => {
  const token = req.cookies.s_t
  if (req.header('origin') != undefined) {
    try {
      q = req.body.q
      if (q == 'teachers') {
        getTeachers(res)
      } else if (q == 'like') {
        if (token == req.body.token && token != undefined) {
          let name = req.body.name
          likeTeacher(res, name)
        } else {
          res.send('no token')
        }
      } else if (q == 'dislike') {
        if (token == req.body.token && token != undefined) {
          let name = req.body.name
          dislikeTeacher(res, name)
        } else {
          res.send('no token')
        }
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
const likeTeacher = async (res, name) => {
  let select = 'SELECT likes FROM teachers WHERE name="' + name + '"'
  let likes = await sequelize.query(select, { type: QueryTypes.SELECT, logging: false })
  likes = likes[0].likes
  likes++
  let update = 'UPDATE teachers SET likes=' + likes + ' WHERE name = "' + name + '"'
  await sequelize.query(update, { logging: false });
  res.cookie('s_t', '')
  res.send('ok')
}
const dislikeTeacher = async (res, name) => {
  let select = 'SELECT likes FROM teachers WHERE name="' + name + '"'
  let likes = await sequelize.query(select, { type: QueryTypes.SELECT, logging: false })
  likes = likes[0].likes
  likes--
  let update = 'UPDATE teachers SET likes=' + likes + ' WHERE name = "' + name + '"'
  await sequelize.query(update, { logging: false });
  res.cookie('s_t', '')
  res.send('ok')
}

app.listen(2083)