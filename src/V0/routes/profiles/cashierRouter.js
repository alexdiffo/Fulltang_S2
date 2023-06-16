const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')
const Resultat = require('../../models/Resultat')
const Examen = require('../../models/Examen')
const { Op } = require('sequelize')



router.use(express.json())

router.use((req,res,next)=>{
    if(req.session.profil!="cashier"){ 
      res.redirect("/fulltang/V0/"+req.session.profil)
    }else{
        next()
    }
})

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
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {paye: "payer"},order: [["updatedAt","DESC"]] }) 
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
.get('/examen_list',  async (req, res)=>{
    const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["id","nom"],required: true},{model: Patient, attributes: ["nom","prenom"], required: true}],attributes:["specialite"] ,where:{'$examens.result.paye$': null},order: [["id","DESC"]] }) 
    res.render("caissier/examen-list",{consultation: list})
 })


//facture examen
.get('/payer_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")
    if(id.length==2){
        const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"],required: true },{model: Patient, attributes: ["nom","prenom"], required: true }],attributes: [] ,where:{'$examens.result.consultationId$': id[0],'$examens.result.examenId$': id[1]} }) 

        if(list.length!=0){
            res.render("caissier/print-examen",{consultation: list})
        }else{
            res.redirect("/fulltang/V0/cashier/examen_list")
        }
        
    }else{
        res.redirect("/fulltang/V0/cashier/examen_list")
    }
    
   
})

.post('/payer_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")
    
    await Resultat.update({paye: "payer", date: new Date()},{where: { consultationId: id[0] ,examenId: id[1] }}) 
    req.flash("positive","payement effectué avec succès")
    res.redirect("/fulltang/V0/cashier/examen_paid") 

})

.get('/print_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")
    if(id.length==2){
        const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"],required: true },{model: Patient, attributes: ["nom","prenom"], required: true }],attributes: [] ,where:{'$examens.result.consultationId$': id[0],'$examens.result.examenId$': id[1]} }) 

        if(list.length!=0){
            res.render("caissier/print-examen",{consultation: list})
        }else{
            res.redirect("/fulltang/V0/cashier/examen_paid")
        }
        
    }else{
        res.redirect("/fulltang/V0/cashier/examen_paid")
    }
    
   
})

.post('/print_examen/:id',  async (req, res)=>{
    res.redirect("/fulltang/V0/cashier/examen_paid")
})


//examen payer
.get('/examen_paid',  async (req, res)=>{
    const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["id","nom"],required: true},{model: Patient, attributes: ["nom","prenom"], required: true}],attributes:["specialite"] ,where:{'$examens.result.paye$': "payer"},order: [["id","DESC"]] }) 
    res.render("caissier/examen-paid",{consultation: list})
})

.get('/dar',  async (req, res)=>{
    let f=["1","3","7"]
    const list = await Patient.findAll({ include: {model: Consultation, where:{id :{ [Op.or]:f} },attributes: ["id","observation"],required: true},attributes: ["nom","prenom"]}) 
    res.send(list)
})

module.exports = router