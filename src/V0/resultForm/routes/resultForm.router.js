const express = require('express')
const router = express.Router()
const Patient = require('../model/Patient')

router.use(express.json())

// all patients routes


//get all patients
router.get('/',  async (req, res)=>{
    const patients = await Patient.findAll()
    res.send(patients)
    
})

//register a new patient
.post('/',  async (req, res)=>{
   await Patient.create(req.body)
   res.send('patient inserted')
    
})


//get a patient by ID
.get('/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    res.send(patient);
})


//Update patient

//delete patient

//set patient state



module.exports = router