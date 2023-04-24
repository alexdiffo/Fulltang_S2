class pagination{


    constructor(tableBloc,nLigne){

        this.nLigne=nLigne
        this.row=tableBloc.querySelectorAll('tbody tr')
        this.tbody=tableBloc.querySelector(".table tbody")
        this.tPage=tableBloc.querySelector(".t-page")
        this.nPage=tableBloc.querySelector(".n-page")
        let next=tableBloc.querySelector(".next")
        let prev=tableBloc.querySelector(".prev")
        //nombre de ligne par page

        //gerer la pagination
        
        this.totalP()
        this.partition(1)

         // defiler les pages
        next.addEventListener("click",()=>{
            if(this.nPage.textContent!=this.tPage.textContent){
                this.partition(parseInt(this.nPage.textContent)+1)
                this.nPage.innerHTML=parseInt(this.nPage.textContent)+1
                window.scrollTo(0,0)
            }
        })

        prev.addEventListener("click",()=>{
            if(this.nPage.textContent!="1"){
                this.partition(parseInt(this.nPage.textContent)-1)
                this.nPage.textContent=parseInt(this.nPage.textContent)-1
                window.scrollTo(0,0)
            }
        })
        
    }

    table(table){
        this.row=table.querySelectorAll('tbody tr')
        this.tbody=table.querySelector(".table tbody")
        this.tPage=table.querySelector(".t-page")
        this.nPage=table.querySelector(".n-page")
    }

    totalP(){
        this.nbre=Math.ceil(this.row.length/this.nLigne)
        if(this.nbre==0){
            this.tPage.textContent=this.nbre+1
        }else{
            this.tPage.textContent=this.nbre
        }
        this.nPage.textContent=1
    }

    partition(a){

        this.tbody.innerHTML=null
        
        var size=a==this.nbre?this.row.length-1:a*this.nLigne-1
        
        for(i=(a-1)*this.nLigne; i<=size;i++){
            
            this.tbody.appendChild(this.row[i])
        }
    }
}


var search=document.querySelector(".search button")
var row=document.querySelectorAll("tbody tr")
var tbody=document.querySelector("tbody")
var input=document.querySelector(".search input")
var page



document.addEventListener("DOMContentLoaded",function(){

   page=new pagination(document.querySelector(".tableBloc"),9)
})


// seach



search.addEventListener("click",()=>{
    tbody.innerHTML=null
    let textSearch=input.value
    row.forEach(i=>{
        let d=false;
        [].slice.call(i.children).forEach(a=>{
            if(a.textContent.toLowerCase().indexOf(textSearch.toLowerCase())!=-1){
                d=true
            } 
        })
        if(d){
            tbody.appendChild(i)
        }

    })
    page.table(tbody.parentNode.parentNode)
    page.totalP()
    page.partition(1)

})

input.addEventListener("keyup",()=>{
    
    if(input.value==""){
        
        row.forEach(i=>{
            tbody.appendChild(i)
        })
        page.table(tbody.parentNode.parentNode)
        page.totalP()
        page.partition(1)
       
    }
})
