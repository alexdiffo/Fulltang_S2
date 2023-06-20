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


////// change password

let passwordForm=document.getElementById("change")

if(passwordForm){

    let n_password=document.getElementById("n_password")
    let c_password=document.getElementById("c_password")


   const verification=(e)=>{
        let ps=p.cloneNode(true)

        
        if(e.target.nextElementSibling){
            e.target.classList.remove("incorrect")
            e.target.parentNode.removeChild(e.target.nextElementSibling)
        }

        if(e.target.value.length < 6){
            e.target.classList.add("incorrect")
            if(!e.target.nextElementSibling){
                e.target.parentNode.appendChild(ps)
            }
            
        
            
        
        }
   }

    let p=document.createElement("p")
    p.classList.add("consigne")
    p.textContent="votre mot de passe doit avoir au minimum 6 caractères"

    c_password.addEventListener("keyup", verification)
    n_password.addEventListener("keyup", verification)


    passwordForm.addEventListener('submit',function(e){
        if(c_password.value.length < 6 || n_password.value.length < 6 ){
            e.preventDefault()
        }else{
            
            if(c_password.value!=n_password.value ){
                e.preventDefault()
                let ps=document.createElement("p")
                ps.classList.add("consigne")
                ps.textContent="votre mot de passe de confirmation est incorrect"
                c_password.classList.add("incorrect")
                if(!c_password.nextElementSibling){
                    c_password.parentNode.appendChild(ps)
                }
            
            }
        }
        
    })

}

///// alert deconnexion
var deconenxion=document.getElementById("deconnexion")

deconenxion.addEventListener("click", function(){
    alert("voulez vous vraiment vous déconnecter?")
})
