const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')

router.use(express.json())

// all cashier routes implemented here

//liste des consultation
.get('/',  async (req, res)=>{
    const patients = await Patient.findAll({ order: [["id","DESC"]],})
    res.render("caissier/caissierList",{patient: patients})    
 })






 // historique des consultation payer
 .get('/consultation_paid',  async (req, res)=>{
    const patients = await Patient.findAll({ order: [["id","DESC"]],})
    res.render("caissier/consultation-paid",{patient: patients})    
 })



//valider le payement
.get('/payer/:id', async(req, res)=>{
    const requestedID = req.params.id
    const patient = await Patient.findOne({where: {id:requestedID}})
    
    res.render("caissier/print",{patient: patient})
})

 //payer la consultation
 .post('/payer/:id', async(req, res)=>{

    req.flash("payement effectué avec succès")
    res.redirect("/fulltang/V0/cashier/consultation_paid") 
})



//reimprimer le recu
.get('/print/:id',  async (req, res)=>{
    const patients = await Patient.findAll({ order: [["id","DESC"]],})
    res.render("caissier/print",{patient: patients})    
 })

.post('/print/:id', async(req, res)=>{

    res.redirect("/fulltang/V0/cashier/consultation_paid") 
})
 


module.exports = router