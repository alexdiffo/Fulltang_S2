///// preloader
jQuery(window).load(function(){
    window.setTimeout(()=>{
        jQuery(".preload").fadeOut(200)
    },500)
    
})

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
var modalBox=document.querySelector("#modalBox")
var text =document.querySelector("#modalBox span")
var val=document.querySelector(".mDecision input")
var cancel=document.querySelector(".mDecision > button")
var sup=document.querySelector('.maj-profil')

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

if(cancel){


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

    if(sup){
    sup.addEventListener("click",box)
}

}

//// carnet modal box
var view=document.querySelector(".voir-carnet")
var exit=document.querySelector(".exit")

if(view){

    view.addEventListener("click",box);

    //fermer la modalBox
    mWindow.addEventListener("click",move)
    exit.addEventListener("click",move)
    modalBox.addEventListener("click",(e)=>{
        e.stopPropagation()
    })
}



////// menu deroulant
var option=document.querySelectorAll(".line-option")
var deroulant=document.querySelector(".deroulant")

if(option){

    option.forEach(i=>{
        i.addEventListener("click",function(){
            i.parentNode.querySelector(".deroulant").classList.toggle("invisible")
        }) 
    })
}



/////// fermer le bloc de notification

var closes=document.querySelector(".notification i")

if(closes){
    closes.addEventListener("click",()=>{
    closes.parentNode.style.display="none"
})
}

////ajouter un champ d examen/pmedicament
var section =document.querySelectorAll("#section")


if(section){

    section.forEach(i=>{
        
        i.querySelector(".form-row i").addEventListener("click", function(){
            i.removeChild(this.parentNode.parentNode.parentNode)
        })

        let add=i.children[1].cloneNode(true)
        

        i.querySelector(".s-regroup button").addEventListener("click", function(){   

            if(i.children[1]){

                add=i.children[1].cloneNode(true)
                i.appendChild(add)

            }else{

                i.appendChild(add)
                
            }

            //supprimer les champ d examen/medicament
            add.querySelector("i").addEventListener("click",function(){
                i.removeChild(this.parentNode.parentNode.parentNode)
            })
            
        })

    })
}
