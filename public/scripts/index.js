const tphoto = document.querySelector('.card-photo')
const tname = document.querySelector('.desc-name')
const tjob = document.querySelector('.desc-job')
let randteacher = {}

const teacher = new XMLHttpRequest()

teacher.open('POST', '/api', true)

let body = {
  query: 'teachers'
}

body = JSON.stringify(body)

teacher.setRequestHeader('Content-Type', 'application/json')

teacher.send(body)

teacher.onload = () => {
    if (teacher.responseText == 'all') {
        tphoto.style.backgroundImage = "url('/img/allphoto.png')"
        tname.innerHTML = 'Все!'
        tjob.innerHTML = 'Вы оценили всех учителей, спасибо!'
    } else {
        randteacher = JSON.parse(teacher.responseText)
        tphoto.style.backgroundImage = "url('" + randteacher.photo + "')"
        tname.innerHTML = randteacher.name
        tjob.innerHTML = randteacher.job
    }
}