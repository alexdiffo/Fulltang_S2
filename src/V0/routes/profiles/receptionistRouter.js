const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Personnel = require('../../models/Personnel')

router.use(express.json())

// all receptionnist routes implemented here

//get all patients
router.get('/',  async (req, res)=>{
    const patients = await Patient.findAll({ order: [["id","DESC"]],})
    res.render("receptionniste/patientList",{patient: patients})
    
})

//supprimer un patient  [uniquement si le patient n'a pas d'historique de prise en charge]
// prevoir une requete pr le cas echeant

router.post ('/',  async (req, res)=>{
    const patients = await Patient.findAll()
    res.render("receptionniste/patientList")
    req.flash("suppression effectué avec succes")

    
})


//register form
.get('/register',  async (req, res)=>{
    res.render("receptionniste/add-patient")    
 })

 //register a patient
.post('/register',  async (req, res)=>{

    await Patient.create(req.body)
    req.flash("nouveau patient ajouter")
    res.redirect("/fulltang/V0/receptionnist") 
})


//get a patient by ID
.get('/patient/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    if(patient){
        res.render("receptionniste/info-patient",{patient: patient})
    }
    else{
        res.redirect("/fulltang/V0/receptionnist") 
    }
    
})

//delete patient
.post('/patient/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.destroy({where: {id:requestedID}})
    
    res.render("receptionniste/info-patient")
})

//update form
.get('/edit/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    if(patient){
        res.render("receptionniste/edit-patient",{patient: patient})
    }
    else{
        res.redirect("/fulltang/V0/receptionnist") 
    }  
    
})


//Update patient
.post('/edit/:id', async(req, res)=>{
    const requestedID = req.params.id
    await Patient.update(req.body,{where: { id: requestedID }})
    req.flash("informations modifiées avec succès")
    res.redirect("/fulltang/V0/receptionnist/patient/"+requestedID) 
})

// new consultation
.get('/new_consultation/:id',  async (req, res)=>{
    const requestedID = req.params.id
    await Patient.update(req.body,{where: { id: requestedID }})
    const patient = await Patient.findOne({where: {id:requestedID}})
    if(patient){
        res.render("receptionniste/new-consultation",{patient: patient})
    }
    else{
        res.redirect("/fulltang/V0/receptionnist") 
    }    
 })



module.exports = router