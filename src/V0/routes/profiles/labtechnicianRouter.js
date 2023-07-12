const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')
const Examen = require('../../models/Examen')
const Resultat = require('../../models/Resultat')
const Personnel = require('../../models/Personnel')
const { Op } = require('sequelize')

router.use(express.json())

router.use((req,res,next)=>{
    if(req.session.user.specialite!="labtechnician"){ 
        if(["cashier","receptionnist","administrator"].includes(req.session.user.specialite)){ 
            res.redirect("/fulltang/V0/"+req.session.user.specialite)
          }else{
              res.redirect("/fulltang/V0/doctor")
          }  
            
    }else{
        next()
    }
})

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

//afficher profil
.get('/profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id } }) 
    res.render("labtechnician/profil",{User: user})
    
})

//modifier profil
.get('/modifier_profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id} }) 
    res.render("labtechnician/modifier-profil",{User: user})
    
})
.post('/modifier_profil',  async (req, res)=>{

    let data=req.body
    if(req.files){
        let image=req.files.image
        image.mv("./static/upload/"+image.name)
        data.url_image="/upload/"+image.name 
        req.session.user.url="/upload/"+image.name 
    }
   
    await Personnel.update(data,{where: { id: req.session.user.id}})
        req.flash("positive","profil modifié avec succès")
        res.redirect("/fulltang/V0/labtechnician/profil")
    
    
})
.get('/profil/password',  async (req, res)=>{
    
    res.render("labtechnician/modifier-password")
    
})
.post('/profil/password',  async (req, res)=>{
    
    let data= req.body
    const user = await Personnel.findOne({ where:{id: req.session.user.id ,password: data.password}}) 

    if(user){
        
        if(data.n_password == data.c_password){

            await Personnel.update({password:data.n_password},{where: { id: req.session.user.id}})
            req.flash("positive","mot de passe modifié avec succès")
            res.redirect("/fulltang/V0/labtechnician/profil")

        }else{
            req.flash("negative","mot de passe de confirmation incorrect")
            res.redirect("/fulltang/V0/labtechnician/profil/password")
        }

    }else{
        req.flash("negative","mot de passe actuel incorrect")
        res.redirect("/fulltang/V0/labtechnician/profil/password")

    }
})

module.exports = router