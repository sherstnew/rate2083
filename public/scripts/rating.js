const top_list = document.querySelector('.top-list')
const req = new XMLHttpRequest()
let rating = []
let counter = 0

req.open('POST', '/api', true)
let body = {
    q: "rating"
}
body = JSON.stringify(body)
req.setRequestHeader('Content-Type', 'application/json')
req.send(body)

req.onload = () => {
    rating = JSON.parse(req.response)
    rating.forEach(el => {
        counter++
        top_list.innerHTML += `<li class="top-item"><span class="counter">${counter}</span>
        ${el.name} (${el.job}) <div class="likes">${el.likes} <i class="uil uil-thumbs-up"></div></i></li>`
    })
}