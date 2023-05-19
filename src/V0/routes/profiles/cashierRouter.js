const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')
const Resultat = require('../../models/Resultat')
const Examen = require('../../models/Examen')



router.use(express.json())

// all cashier routes implemented here

//liste des consultation
.get('/',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {paye: null},order: [["id","DESC"]] }) 
    res.render("caissier/caissierList",{ consultation: list})    
 })



//valider le payement
.get('/payer/:id', async(req, res)=>{
    const requestedID = req.params.id
    const list = await Consultation.findOne({ include: {model: Patient,required: true}, where: {id: requestedID} }) 

    if(list){
        res.render("caissier/print",{consultation: list})
    }
    else{
        res.redirect("/fulltang/V0/cashier")
    }
    
    
})

 //payer la consultation
 .post('/payer/:id', async(req, res)=>{
    const requestedID = req.params.id
    await Consultation.update({paye: "payer"},{where: { id: requestedID }}) 
    req.flash("positive","payement effectué avec succès")
    res.redirect("/fulltang/V0/cashier/consultation_paid") 
})


 // historique des consultation payer
 .get('/consultation_paid',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {paye: "payer"},order: [["id","DESC"]] }) 
    res.render("caissier/consultation-paid",{consultation: list})    
 })




//reimprimer le recu
.get('/print/:id',  async (req, res)=>{
    const requestedID = req.params.id
    const list = await Consultation.findOne({ include: {model: Patient,required: true}, where: {id: requestedID} }) 

    if(list){
        res.render("caissier/print",{consultation: list})
    }
    else{
        res.redirect("/fulltang/V0/cashier/consultation_paid") 
    }    
 })

.post('/print/:id', async(req, res)=>{

    res.redirect("/fulltang/V0/cashier/consultation_paid") 
})
 
// liste des examens
.get('/exam_list',  async (req, res)=>{
    const list = await Resultat.findAll({ include:[{model: Examen,required: true},{model: Consultation,required: true}] ,order: [["id","DESC"]] }) 
    console.log(list)
 })


module.exports = router