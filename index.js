"use strict";
const express = require('express')
const app = express()
const port = 8080
const IndexRouter= require('./src/V0/index.router')
const message=require("./middleware/message")
const bodyParser = require('body-parser')
const session = require('express-session')


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


const sequelize = require('./src/V0/repository/database');
sequelize.sync({alter:true}).then(()=>console.log('database is up and running!'))
.catch((err)=>{
    console.log('Error connecting database');
})


app.use('/fulltang/V0', IndexRouter)

app.listen(port, ()=>{ console.log(`server is running on port ${port}`)})