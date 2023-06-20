"use strict";
const express = require('express')
const app = express()
const port = 8080
const server=require('http').createServer(app)
const{Server}=require('socket.io')
const io = new Server(server)
const fileUploader=require('express-fileupload')

module.exports=io

const IndexRouter= require('./src/V0/index.router')
const message=require("./middleware/message")
const bodyParser = require('body-parser')
const session = require('express-session')
const Personnel = require('./src/V0/models/Personnel')



//moteur de template
app.set("view engine","ejs")

//middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static("static"))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    
    saveUninitialized: true,
    cookie: { secure: false}
  }))
app.use(message)
app.use(fileUploader({
  createParentPath: true
}))





const sequelize = require('./src/V0/repository/database');
sequelize.sync({alter: false}).then(()=>console.log('database is up and running!'))
.catch((err)=>{
    console.log('Error connecting database');
})



app.use('/fulltang/V0', IndexRouter)


server.listen(port, ()=>{ console.log(`server is running on port ${port}`)})


io.on('connection', (socket) =>{


  console.log(`connected - -- - - - - - - - - -- - - - -  ${socket.id}`)
})

//login route
app.get('/fulltang/login',async (req,res)=>{

  res.render("login")
  
})

app.post('/fulltang/login', async (req,res)=>{
  
let user= req.body 
let personnel= await Personnel.findOne({where: {email: user.email, password: user.password }})

if(personnel){

  req.session.user={ id: personnel.id , specialite: personnel.specialite ,nom: personnel.nom , prenom:personnel.prenom ,url: personnel.url_image }

  if(["receptionnist","cashier","administrator","labtechnician"].includes(personnel.specialite)){
    res.redirect("/fulltang/V0/"+personnel.specialite)
  }else{
    res.redirect("/fulltang/V0/doctor")
  }
  

}else{
  req.flash("negative","identifiant incorrect veuillez reésayer")
  res.redirect("/fulltang/login") 
}
})

