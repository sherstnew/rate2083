const tphoto = document.querySelector('.card-photo')
const tname = document.querySelector('.desc-name')
const tjob = document.querySelector('.desc-job')
const tlikes = document.querySelector('.rating-counter')
const change_btn = document.querySelector('.change-btn')
const like_btn = document.querySelector('.uil-thumbs-up')
let trand = 0
let teacher = {}
let localst = ''
let likes = ''
let teachers = []

const change = () => {
    const req = new XMLHttpRequest()
    

    req.open('POST', '/api', true)
    let body = {
      q: "teachers"
    }
    body = JSON.stringify(body)
    req.setRequestHeader('Content-Type', 'application/json')
    req.send(body)
    
    req.onload = () => {
        teachers = JSON.parse(req.response)
        trand = Math.floor(Math.random() * teachers.length)
        teacher = teachers[trand]
        tphoto.style.backgroundImage = "url('" + teacher.photo + "')"
        tname.innerHTML = teacher.name
        tjob.innerHTML = teacher.job
        tlikes.innerHTML = teacher.likes
        teachers.splice(trand, 1)
    }
}

change()

change_btn.addEventListener('click', change)

like_btn.addEventListener('click', () => {
    likes++
    const req_like = new XMLHttpRequest()
    req_like.open('POST', '/api', true)
    let body = {
      name: "",
      likes: 0,
      q: "like"
    }
    body.name = teacher.name
    body.likes = likes
    body = JSON.stringify(body)
    req_like.setRequestHeader('Content-Type', 'application/json')
    req_like.send(body)
    change()
})
