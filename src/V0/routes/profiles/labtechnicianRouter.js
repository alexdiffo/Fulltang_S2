const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')
const Examen = require('../../models/Examen')
const Resultat = require('../../models/Resultat')
const { Op } = require('sequelize')

router.use(express.json())

// all labtech routes implemented here...


// liste des examens
.get('/',  async (req, res)=>{
    const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["id","nom"],required: true},{model: Patient, attributes: ["nom","prenom"], required: true}],attributes:["specialite"] ,where:{'$examens.result.paye$': "payer",'$examens.result.description$':null},order: [["updatedAt","DESC"]] }) 
    res.render("labtechnician/examen-list",{consultation: list})
})

.get('/description_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")
    if(id.length==2){
        const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"],required: true },{model: Patient, attributes: ["nom","prenom"], required: true }],attributes: [] ,where:{'$examens.result.consultationId$': id[0],'$examens.result.examenId$': id[1] ,'$examens.result.paye$': "payer",'$examens.result.description$':null } }) 

        if(list.length!=0){
            res.render("labtechnician/add-description",{consultation: list})
        }else{
            res.redirect("/fulltang/V0/labtechnician")
        }
        
    }else{
        res.redirect("/fulltang/V0/labtechnician")
    }
    
   
})

.post('/description_examen/:id',  async (req, res)=>{

    const id = req.params.id.split("_")

    await Resultat.update(req.body,{where: { consultationId: id[0],examenId: id[1] }}) 
    req.flash("positive","examen traité avec succès")
    res.redirect("/fulltang/V0/labtechnician/examen_history")
})


.get('/examen_history',  async (req, res)=>{
    const list = await Consultation.findAll({ include:[{model: Examen,attributes: ["id","nom"],required: true},{model: Patient, attributes: ["nom","prenom"], required: true}],attributes:["specialite"] ,where:{'$examens.result.paye$': "payer",'$examens.result.description$':{[Op.not]: null}},order: [["updatedAt","DESC"]] }) 
    res.render("labtechnician/examen-history",{consultation: list})
})


module.exports = router