let API_KEY = 'dcea1fd7b3e65d34387ad6de7ef9cc5e'

// let API_KEY = 'b971c2f0de8767f08d2bb84160ba24b7'

let tokenUpcoming = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=`
let tokenTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=`
let tokenPop = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=`

let topFilms = document.querySelectorAll(".btns")[0]
let popFilms = document.querySelectorAll(".btns")[1]
let upFilms = document.querySelectorAll(".btns")[2]

const prev = document.querySelector(".prev")
const next = document.querySelector(".next")
const titleNp = document.querySelector(".title")

const searchBtn = document.querySelector(".btn")
const maxYear = document.getElementById("max")
const minYear = document.getElementById("min")
const score = document.getElementById("score")
const searchInp = document.getElementById("search")

const appendHtml = document.querySelector(".append")

let countNext = 1
let which = 1


topFilms.addEventListener("click",async ()=>{
    begin()
    which = 1
    countNext = 1
    titleNp.textContent = countNext
    clear()
})

upFilms.addEventListener("click",async ()=>{
    let response = await fetch(tokenUpcoming+"1")
    let natija = await response.json()
    render(natija)
    which = 2
    countNext = 1
    titleNp.textContent = countNext
    clear()
})

popFilms.addEventListener("click",async ()=>{
    let response = await fetch(tokenPop+"1")
    let natija = await response.json()
    render(natija)
    which = 3
    countNext = 1
    titleNp.textContent = countNext
    clear()
})


begin()

async function begin(){
    let response = await fetch(tokenTop+"1")
    let natija = await response.json()
    render(natija)
}




function render(base) {
    appendHtml.innerHTML = null
    for(let i of base.results) {
        let div = document.createElement('div')
        div.classList.add('movie')
        div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${i.poster_path}" alt="Fast &amp; Furious Presents: Hobbs &amp; Shaw">
   
        <div class="movie-info">
            <h3>${i.title}</h3>
            <span class="orange">${i.vote_average}</span>
         </div>
         <span class="date">${i.release_date}</span>`

         appendHtml.append(div)
    }
}


next.addEventListener("click",async ()=>{
    clear()
    if(which==1){
        countNext++ 
        let response = await fetch(tokenTop+countNext)
        let natija = await response.json()
        render(natija)
        titleNp.textContent = countNext
        console.log(natija)

    }
    else if(which==2){
        countNext++ 
        let response = await fetch(tokenUpcoming+countNext)
        let natija = await response.json()
        render(natija)
        titleNp.textContent = countNext
    }
    else if(which==3){
        countNext++ 
        let response = await fetch(tokenPop+countNext)
        let natija = await response.json()
        render(natija)
        titleNp.textContent = countNext
    }
})



prev.addEventListener("click",async ()=>{
    clear()
    if(which==1){
        if(countNext==1) return
        countNext-- 
        let response = await fetch(tokenTop+countNext)
        let natija = await response.json()
        render(natija)
        titleNp.textContent = countNext
    }
    else if(which==2){
        if(countNext==1) return
        countNext-- 
        let response = await fetch(tokenUpcoming+countNext)
        let natija = await response.json()
        render(natija)
        titleNp.textContent = countNext
    }
    else if(which==3){
        if(countNext==1) return
        countNext-- 
        let response = await fetch(tokenPop+countNext)
        let natija = await response.json()
        render(natija)
        titleNp.textContent = countNext
    }
})


searchBtn.addEventListener("click",async ()=>{
    if(searchInp.value.length==0 && minYear.value.length==0 && 
    score.value.length==0 && maxYear.value.length==0) return
    
    let allArray = []
    let api
    if(which==1){api=tokenTop+countNext}
    else if(which==2){api=tokenUpcoming+countNext}
    else if(which==3){api=tokenPop+countNext}

    let response = await fetch(api)
    let natija = await response.json()

    if(searchInp.value.length!=0){
        for(let j of natija.results){
            if(j.title.toLowerCase().includes(searchInp.value.toLowerCase())){
                allArray.push(j)
            }
        }
    }

    if(minYear.value.length!=0){
        let newArray = []
        if(allArray.length!=0){
            for(let j of allArray){
                let year = ""
                for(let p=0;p<4;p++){year+=j.release_date[p]}
                if(parseInt(minYear.value)<=parseInt(year)){
                    newArray.push(j)
                }
            }
            allArray = newArray
        }
        else{
            for(let j of natija.results){
                let year = ""
                for(let p=0;p<4;p++){year+=j.release_date[p]}
                if(parseInt(minYear.value)<=parseInt(year)){
                    allArray.push(j)
                }
            }
        }
    }

    if(maxYear.value.length!=0){
        let newArray = []
        if(allArray.length!=0){
            for(let j of allArray){
                let year = ""
                for(let p=0;p<4;p++){year+=j.release_date[p]}
                if(parseInt(maxYear.value)>=parseInt(year)){
                    newArray.push(j)
                }
            }
            allArray = newArray
        }

        else {
            for(let j of natija.results){
                let year = ""
                for(let p=0;p<4;p++){year+=j.release_date[p]}
                if(parseInt(maxYear.value)>=parseInt(year)){
                    allArray.push(j)
                }
            }
        }
    }

    if(score.value.length!=0){
        let newArray = []
        if(allArray.length!=0){
            for(let j of allArray){
                if(score.value<=j.vote_average){
                    newArray.push(j)
                }
            }
            allArray = newArray
        }

        else {
            for(let j of natija.results){
                if(score.value<=j.vote_average){
                    allArray.push(j)
                }
            }
        }
    }
    clear()

    let obj = {results:allArray}
    render(obj)

})


function clear(){
    searchInp.value = ''
    minYear.value = '' 
    score.value = ''
    maxYear.value = ''
}