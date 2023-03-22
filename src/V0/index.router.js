const express = require('express')
const router = express.Router()
const PatientRouter = require('./patient/routes/patient.router')

router.use('/patient', PatientRouter)
router.get('/', (req,res)=>{
    res.send(` Welcome to fulltang V0`)
})

module.exports = router