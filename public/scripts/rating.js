const rating_list = document.querySelector('.rating-list')
const req = new XMLHttpRequest()
let rating = []
let counter = 0
let likes

tcount = JSON.parse(localStorage.getItem('tcount'))
tcount--
localStorage.setItem('tcount', tcount)

const renderList = () => {
    rating_list.innerHTML = ''
    counter = 0
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
            const rating_item = document.createElement('li')
            const like_btn = document.createElement('i')

            like_btn.classList.add('uil')
            like_btn.classList.add('uil-thumbs-up')

            rating_item.classList.add('rating-item')
            rating_item.innerHTML = `<span class="counter">${counter}</span>
            ${el.name} (${el.job}) <div class="likes">${el.likes}</div>`
            rating_item.append(like_btn)

            if (localStorage.getItem(el.name) == 'true') {
                like_btn.style.color = '#e63946'
            }

            rating_list.append(rating_item)

        // like handler

            like_btn.addEventListener('click', () => {
                if (localStorage.getItem(el.name) != 'true') {
                    likes = el.likes
                    likes += 1
                    const req_like = new XMLHttpRequest()
                    req_like.open('POST', '/api', true)
                    let body = {
                        name: "",
                        likes: 0,
                        q: "like"
                    }
                    body.name = el.name
                    body.likes = likes
                    body = JSON.stringify(body)
                    req_like.setRequestHeader('Content-Type', 'application/json')
                    req_like.send(body)
                
                    rating_item.innerHTML = `<span class="counter">${counter}</span>
                    ${el.name} (${el.job}) <div class="likes">${likes} <i class="uil uil-thumbs-up"></div></i>`
                    like_btn.style.animation = 'like 0.5s'
                    like_btn.style.color = '#e63946'
                    localStorage.setItem(el.name, 'true')
                    setTimeout(renderList, 500)
                } else if (localStorage.getItem(el.name) == 'true'){
                    likes = el.likes
                    likes -= 1
                    const req_like = new XMLHttpRequest()
                    req_like.open('POST', '/api', true)
                    let body = {
                        name: "",
                        likes: 0,
                        q: "like"
                    }
                    body.name = el.name
                    body.likes = likes
                    body = JSON.stringify(body)
                    req_like.setRequestHeader('Content-Type', 'application/json')
                    req_like.send(body)
            
                    rating_item.innerHTML = `<span class="counter">${counter}</span>
                    ${el.name} (${el.job}) <div class="likes">${likes} <i class="uil uil-thumbs-up"></div></i>`

                    like_btn.style.animation = 'dislike 0.5s'
                    like_btn.style.color = '#000'
                    localStorage.removeItem(el.name)
                    setTimeout(renderList, 500)
                }
            })
        })
    }
}

renderList()