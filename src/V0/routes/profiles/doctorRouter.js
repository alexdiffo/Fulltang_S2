const express = require('express')
const router = express.Router()
const Patient = require('../../models/Patient')
const Consultation = require('../../models/Consultation')
const Parametre = require('../../models/Parametres')
const Examen = require('../../models/Examen')
const Medicament = require('../../models/Medicament')
const Prescription = require('../../models/Prescription')
const Resultat = require('../../models/Resultat')
const { EMPTY } = require('sqlite3')
const { Op } = require('sequelize')
const Personnel = require('../../models/Personnel')

router.use(express.json())

router.use((req,res,next)=>{
    if(["receptionnist","cashier","administrator","labtechnician"].includes(req.session.user.specialite)){ 
      res.redirect("/fulltang/V0/"+req.session.user.specialite)
    }else{
        next()
    }
})





//liste des patient a consulter
.get('/',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: { [Op.or]:[{paye: "payer", specialite: req.session.user.specialite ,date: null},{rendez_vous: "oui", specialite: req.session.user.specialite,date: null}] },order: [["id","DESC"]] }) 
    res.render("medecin/patient-list",{ consultation: list})    
})


//consulter un patient
.get('/consultation/:id',  async (req, res)=>{
    const requestedID = req.params.id
    const list = await Consultation.findOne({ include: {model: Patient,required: true}, where: { [Op.or]:[{id: requestedID ,paye: "payer",date: null, specialite: req.session.user.specialite},{id: requestedID ,rendez_vous: "oui",date: null, specialite: req.session.user.specialite}]  } })

    if(list){
        const carnet = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"],required: true},{model: Personnel,attributes: ["nom"],required: true},{model: Medicament,attributes: ["nom"],required: true},{model: Parametre, required: true}],attributes:["date","observation","diagnostic"] ,where:{ date: {[Op.not]: null},patientId: "list.patient.id"},order: [["id","DESC"]] }) 
        const examen= await Examen.findAll()
        const medicament = await Medicament.findAll()
        res.render("medecin/consultation",{patient: list.patient,medicament: medicament,examen: examen,carnet:carnet})  
    }else{
        res.redirect("/fulltang/V0/doctor")
    }  

   
})


//enregistrer la consultation
.post('/consultation/:id',  async (req, res)=>{

    let id=req.params.id;

    await Parametre.create({
        consultationId: id, 
        poids:req.body.poids,
        temperature:req.body.temperature ,
        pression_arterielle: req.body.tension,
        groupe_sanguin: req.body.groupe_s,
        rhesus: req.body.rhesus,
    })

    await Consultation.update({date: new Date(), diagnostic: req.body.diagnostic, observation: req.body.observation, personnelId: req.session.ID},{where: { id: id }})

    if(req.body.medicament){
        Array.from(req.body.medicament).forEach( async (i)=> {
            await Prescription.create({
                medicamentId: i,
                consultationId: id,
            })
        });
    }

    if(req.body.examen){
        Array.from(req.body.examen).forEach( async (i)=> {
            await Resultat.create({
                examenId: i,
                consultationId: id,
            })
        });
    }

    req.flash("positive","consultation enregistrer avec succès")
    res.redirect("/fulltang/V0/doctor/consultation_history")

})


.get('/consultation_history',  async (req, res)=>{
    const list = await Consultation.findAll({ include: {model: Patient,required: true}, where: {date: {[Op.not]: null} },order: [["id","DESC"]] }) 
    res.render("medecin/consultation-history",{ consultation: list})    

})


////carnet du patient
.get('/carnet_patient/:id',  async (req, res)=>{

    let id=req.params.id;
    const patient= await Patient.findOne({ where: {id: id}, attributes: ["nom","prenom"] })

    if(patient){
        const carnet = await Consultation.findAll({ include:[{model: Examen,attributes: ["nom"]},{model: Personnel,attributes: ["nom"],required: true},{model: Medicament,attributes: ["nom"]},{model: Parametre, required: true}],attributes:["date","observation","diagnostic"] ,where:{ date: {[Op.not]: null},patientId: id},order: [["id","DESC"]] }) 
        res.render("medecin/carnet", {carnet: carnet, patient: patient}) 
    }else{
        res.redirect("/fulltang/V0/doctor/consultation_history")
    }
       
})

.get('/profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id } }) 
    res.render("medecin/profil",{User: user})
    
})

//modifier profil
.get('/modifier_profil',  async (req, res)=>{
    const user = await Personnel.findOne({ where:{id: req.session.user.id } }) 
    res.render("medecin/modifier-profil",{User: user})
    
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
        req.flash("positive","profil modifier avec succès")
        res.redirect("/fulltang/V0/doctor/profil")
    
    
})

.get('/profil/password',  async (req, res)=>{
    
    res.render("medecin/modifier-password")
    
})
.post('/profil/password',  async (req, res)=>{
    
    let data= req.body
    const user = await Personnel.findOne({ where:{id: req.session.user.id ,password: data.password}}) 

    if(user){
        
        if(data.n_password == data.c_password){

            await Personnel.update({password:data.n_password},{where: { id: req.session.user.id}})
            req.flash("positive","mot de passe modifier avec succès")
            res.redirect("/fulltang/V0/doctor/profil")

        }else{
            req.flash("negative","mot de passe de confirmation incorrect")
            res.redirect("/fulltang/V0/doctor/profil/password")
        }

    }else{
        req.flash("negative","mot de passe actuel incorrect")
        res.redirect("/fulltang/V0/doctor/profil/password")
    }

    
})


module.exports = router