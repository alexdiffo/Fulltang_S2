const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')


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

    const id=req.body.id
    
    const consultation = await Consultation.findOne({where: {patientId: id}})

    if(consultation){
        req.flash("negative","impossible de supprimer ce patient car il a déja effectué des actions dans le systeme")
        res.redirect("/fulltang/V0/receptionnist") 
    }
    else{
        await Patient.destroy({ where: {id: id}})
        req.flash("positive","le patient a été supprimer")
        res.redirect("/fulltang/V0/receptionnist") 

    }
   
    
})


//register form
.get('/register',  async (req, res)=>{
    res.render("receptionniste/add-patient")    
 })

 //register a patient
.post('/register',  async (req, res)=>{

    await Patient.create(req.body)
    req.flash("positive","nouveau patient ajouter")
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
    const id = req.params.id

    const consultation = await Consultation.findOne({where: {patientId: id}})

    if(consultation){
        req.flash("negative","impossible de supprimer ce patient car il a déja effectué des actions dans le systeme")
        res.redirect("/fulltang/V0/receptionnist/patient/"+id) 
    }
    else{
        await Patient.destroy({ where: {id: id}})
        req.flash("positive","le patient a été supprimer")
        res.redirect("/fulltang/V0/receptionnist") 

    }
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
    req.flash("positive","informations modifiées avec succès")
    res.redirect("/fulltang/V0/receptionnist/patient/"+requestedID) 
})

// new consultation
.get('/new_consultation/:id',  async (req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    if(patient){
        res.render("receptionniste/new-consultation",{patient: patient})
    }
    else{
        res.redirect("/fulltang/V0/receptionnist") 
    }    
 })

.post('/new_consultation/:id',  async (req, res)=>{

    await Consultation.create(req.body)

    req.flash("positive","consultation creer avec succès")
    res.redirect("/fulltang/V0/receptionnist/consultation_history") 

})


// historique des consultation
router.get('/consultation_history',  async (req, res)=>{
    const list = await Consultation.findAll({ include: Patient,order: [["id","DESC"]] }) 
    res.render("receptionniste/consultation-list",{consultation: list})
    
})


module.exports = router