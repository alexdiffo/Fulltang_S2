

//////defiler la navigation
var item=document.querySelectorAll(".section")

item.forEach(i=>{i.firstElementChild.addEventListener("click",()=>{
    i.lastElementChild.classList.toggle("height")
})
})


///// defiler la left-bar
var i=document.querySelector(".logo i")
var c=document.querySelector(".left-container")
var bar=document.querySelector(".left-bar")
var icon=document.querySelector(".entete i")

const slide=()=>{
    bar.classList.remove("translate")
    window.setTimeout(()=>{
        c.classList.remove("visibles")
    },200)
}

i.addEventListener("click",()=>{
    c.classList.add("visibles")
    window.setTimeout(()=>{
        bar.classList.add("translate")
    },10)
})

icon.addEventListener("click",slide)
c.addEventListener("click",slide)
bar.addEventListener("click",(e)=>{
    e.stopPropagation()
})


///////modal box

var del=document.querySelectorAll(".tDel")
var mWindow=document.querySelector(".mWindow")
var modalBox=document.querySelector(".modalBox")
var text =document.querySelector(".modalBox span")
var val=document.querySelector(".mDecision input")
var cancel=document.querySelector(".mDecision > button")


const move=()=>{
    mWindow.style.opacity=null
    modalBox.style.transform=null
    window.setTimeout(()=>{
        mWindow.style.display=null
        mWindow.setAttribute("aria-hidden","true ")
    },400)
}

const box=()=>{
        mWindow.style.display="flex"
        mWindow.removeAttribute("aria-hidden")
        window.setTimeout(()=>{
            mWindow.style.opacity="1"
            modalBox.style.transform="translateY(0px)"
        },10)
}

//ovrir la modalBox
del.forEach(i=>{
    i.addEventListener("click", function(){

        text.textContent=i.parentNode.parentNode.children[1].textContent
        val.setAttribute("value",i.parentNode.parentNode.children[0].textContent)
        box()
    })
})

//fermer la modalBox
mWindow.addEventListener("click",move)
cancel.addEventListener("click",move)

modalBox.addEventListener("click",(e)=>{
    e.stopPropagation()
})


/////// fermer le bloc de notification

var closes=document.querySelector(".notification i")

closes.addEventListener("click",()=>{
    closes.parentNode.style.display="none"
})

