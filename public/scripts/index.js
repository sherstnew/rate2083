const tphoto = document.querySelector('.card-photo')
const tname = document.querySelector('.desc-name')
const tjob = document.querySelector('.desc-job')
const tlikes = document.querySelector('.rating-counter')
const change_btn = document.querySelector('.change-btn')
const like_btn = document.querySelector('.uil-thumbs-up')
const search = document.querySelector('.search')
const search_btn = document.querySelector('.uil-search')
const search_error = document.querySelector('.search-error')
const search_var = document.querySelector('.search-variants')

let tcount = 0
let teacher = {}
let teachers = []
let s_teachers = []
let s_query = ''
let s_mode = false
let s_current = 0
let s_last = 0
let likes = ''
let el_array = []
let a_mode = false

if (localStorage.getItem('tcount') == null) {
    localStorage.setItem('tcount', tcount)
}

const change = () => {
    if (a_mode == true) {
        change_btn.innerHTML = 'Следующий'
        a_mode = false
        tcount = 0
        localStorage.setItem('tcount', tcount)
    }
    if (localStorage.getItem('h_mode') == null) {
        search_error.innerHTML = ' '
        likes = 0
        tphoto.style.backgroundImage = "url('img/hellophoto.png')"
        tname.innerHTML = 'Привет!'
        tjob.innerHTML = 'Поставь лайк любимому учителю и узнай, кто в топе!'
        tlikes.innerHTML = ''
        like_btn.style.opacity = '0'
        change_btn.innerHTML = 'Начать'
        localStorage.setItem('h_mode', 'true')
    } else {
        change_btn.innerHTML = 'Следующий'
        like_btn.style.opacity = '1'
        s_mode = false
        while (search_var.firstChild) {
            search_var.removeChild(search_var.firstChild);
        }
        like_btn.style.animation = 'none'
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
            if (tcount >= teachers.length) {
                renderTeacher('all')
            } else {
                tcount = JSON.parse(localStorage.getItem('tcount'))
                teacher = teachers[tcount]
                tcount++
                localStorage.setItem('tcount', tcount)
                renderTeacher(teacher)
            }
        }
    }
}

change()

change_btn.addEventListener('click', change)

const f_search = () => {
    localStorage.setItem('h_mode', 'true')
    change_btn.innerHTML = 'Следующий'
    like_btn.style.opacity = '1'
    s_query = ''
    if (search.value != '' ) { 
        s_query = ''  
        el_array = []      
        s_query = search.value
        search.value = ''
        s_query = s_query.toLowerCase().split(' ')
        s_query.forEach(el => {
            el = el[0].toUpperCase() + el.slice(1)
            el_array.push(el)
        });
        s_query = el_array.join(' ')

        const s_req = new XMLHttpRequest()
        s_req.open('POST', '/api', true)
        let body = {
        q: "search",
        sq: ""
        }
        body.sq = s_query
        body = JSON.stringify(body)
        s_req.setRequestHeader('Content-Type', 'application/json')
        s_req.send(body)
        s_req.onload = () => {
            if (s_req.response != '[]') {
                s_mode = true
                while (search_var.firstChild) {
                    search_var.removeChild(search_var.firstChild);
                }
                if (JSON.parse(s_req.response).length == 1) {
                    teacher = JSON.parse(s_req.response)[0]
                    renderTeacher(teacher)
                } else if (JSON.parse(s_req.response).length > 1) {
                    s_teachers = JSON.parse(s_req.response)
                    teacher = s_teachers[s_current]
                    renderTeacher(teacher)
                    for (let i = 1; i < s_teachers.length + 1; i++) {
                        const variant = document.createElement('div')                 
                        
                        variant.classList.add('search-variant')
                        variant.innerHTML = i
                        search_var.append(variant)

                        s_last = search_var.childNodes[s_current]

                        if (i == s_current + 1) {
                            variant.style.background = '#000'
                            variant.style.color = '#ffffff'
                        }

                        variant.addEventListener('click', () => {
                            s_last.style.background = '#ffffff'
                            s_last.style.color = '#000'
                            s_current = variant.innerText - 1
                            variant.style.background = '#000'
                            variant.style.color = '#ffffff'
                            teacher = s_teachers[s_current]
                            s_last = variant
                            renderTeacher(teacher)
                        })
                    }
                }
            } else if (s_req.response = '[]') {
                search_error.innerHTML = 'учитель не найден :('
            }
        }
    }
}

like_btn.addEventListener('click', () => {
    const token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
    if (localStorage.getItem(teacher.name) != 'true' && a_mode == false) {
        document.cookie = 's_t=' + token
        likes++
        const req_like = new XMLHttpRequest()
        req_like.open('POST', '/api', true)
        let body = {
        name: "",
        token: "",
        q: "like"
        }
        body.name = teacher.name
        body.token = token
        body = JSON.stringify(body)
        req_like.setRequestHeader('Content-Type', 'application/json')
        req_like.send(body)
    
        tlikes.innerHTML = likes
        like_btn.style.animation = 'like 0.5s'
        like_btn.style.color = '#e63946'
        localStorage.setItem(teacher.name, 'true')
        if (s_mode == false) {
            setTimeout(change, 500)
        } else {
            setTimeout(f_search, 500)
        }
    } else if (localStorage.getItem(teacher.name) == 'true' && a_mode == false){
        document.cookie = 's_t=' + token
        likes--
        const req_like = new XMLHttpRequest()
        req_like.open('POST', '/api', true)
        let body = {
        name: "",
        token: "",
        q: "dislike"
        }
        body.name = teacher.name
        body.token = token
        body = JSON.stringify(body)
        req_like.setRequestHeader('Content-Type', 'application/json')
        req_like.send(body)

        tlikes.innerHTML = likes
        like_btn.style.animation = 'dislike 0.5s'
        like_btn.style.color = '#000'
        localStorage.removeItem(teacher.name)
        if (s_mode == false) {
            setTimeout(change, 500)
        }  else {
            setTimeout(f_search, 500)
        }
    }
})

search_btn.addEventListener('click', f_search)

const renderTeacher = (teacher) => {

    if (teacher == 'all' || teacher == undefined) {
        like_btn.style.color = 'black'
        a_mode = true
        search_error.innerHTML = ' '
        likes = 0
        tphoto.style.backgroundImage = "url('img/allphoto.png')"
        tname.innerHTML = 'Все!'
        tjob.innerHTML = 'Вы просмотрели всех учителей, спасибо!'
        change_btn.innerHTML = 'Заново'
        tlikes.innerHTML = 0
        } else {
        if (localStorage.getItem(teacher.name) == 'true') {
            like_btn.style.color = '#e63946'
        } else {
            like_btn.style.color = 'black'
        }

        search_error.innerHTML = ' '
        likes = teacher.likes
        tphoto.style.backgroundImage = "url('" + teacher.photo + "')"
        tname.innerHTML = teacher.name
        tjob.innerHTML = teacher.job
        tlikes.innerHTML = teacher.likes
    }
}
