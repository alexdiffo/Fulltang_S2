"use strict";
const express = require('express')
const app = express()
const port = 8080
const IndexRouter= require('./src/V0/index.router')

const sequelize = require('./src/V0/repository/database');
sequelize.sync({alter:true}).then(()=>console.log('database is up and running!'))
.catch((err)=>{
    console.log('Error connecting database');
})


app.use('/fulltang/V0', IndexRouter)

app.listen(port, ()=>{ console.log(`server is running on port ${port}`)})