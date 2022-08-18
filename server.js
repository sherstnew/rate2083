const express = require('express')

const app = express()
const port = 4000

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile('/index.html')
})

app.listen(port, () => {
    console.log(`Starting on http://127.0.0.1:${port}`)
  })