const express = require('express')
const router = express.Router()
const Personnel = require('../../models/Personnel')
const Examen = require('../../models/Examen')
const Resultat = require('../../models/Resultat')
const Medicament = require('../../models/Medicament')
const Prescription = require('../../models/Prescription')


router.use(express.json())


// all administrator routes implemented here...

//liste du personnels
.get('/',  async (req, res)=>{
    const list = await Personnel.findAll({order: [["id","DESC"]] }) 
    res.render("administrator/personnel-list",{ personnel: list})    
})

//ajouter un personnel
.get('/add_personnel',  async (req, res)=>{
    res.render("administrator/add-personnel")    
})

.post('/add_personnel',  async (req, res)=>{

    let personnel=req.body
    personnel.password="fultang"

    await Personnel.create(personnel)
    req.flash("positive","nouveau personnel ajouter avec succès")
    res.redirect("/fulltang/V0/administrator") 
})

.get('/personnel/:id',  async (req, res)=>{
    const id = req.params.id
    const personnel = await Personnel.findOne({where: {id:id}})
    if(personnel){
        res.render("administrator/info-personnel",{personnel: personnel})
    }
    else{
        res.redirect("/fulltang/V0/administrator") 
    }  
})




//// examen crud


// ajouter examen
.get('/add_examen',  async (req, res)=>{
    res.render("administrator/add-examen")    
})

.post('/add_examen',  async (req, res)=>{
    await Examen.create(req.body)
    req.flash("positive","nouvel examen ajouter avec succès")
    res.redirect("/fulltang/V0/administrator/examen_list") 
})

//liste des examens
.get('/examen_list',  async (req, res)=>{
    const list = await Examen.findAll({order: [["id","DESC"]] })
    res.render("administrator/examen-list",{examen: list})    
})

// supprimer un examen
.post('/examen_list',  async (req, res)=>{

    const id=req.body.id
    const resultat= await Resultat.findOne({where: {examenId: id}})

    if(resultat){
        req.flash("negative","impossible de supprimer cet examen car il a déja été utilisé dans le système")
        res.redirect("/fulltang/V0/administrator/examen_list") 
    }
    else{
        await Examen.destroy({ where: {id: id}})
        req.flash("positive","Examen supprimé avec succès")
        res.redirect("/fulltang/V0/administrator/examen_list") 

    }
})



// editer un examen
.get('/examen/:id/edit',  async (req, res)=>{

    const id = req.params.id
    const list = await Examen.findOne({where: {id:id}})

    if(list){
        res.render("administrator/edit-examen",{examen: list})
    }
    else{
        res.redirect("/fulltang/V0/administrator/examen_list")
    }
        
})

.post('/examen/:id/edit',  async (req, res)=>{

    const id = req.params.id
    await Examen.update(req.body,{where: { id: id }})
    req.flash("positive","Examen modifié avec succès")
    res.redirect("/fulltang/V0/administrator/examen_list") 

})




//// medicament crud


// ajouter medicament
.get('/add_medicament',  async (req, res)=>{
    res.render("administrator/add-medicament")    
})

.post('/add_medicament',  async (req, res)=>{
    await Medicament.create(req.body)
    req.flash("positive","nouveau medicament ajouter avec succès")
    res.redirect("/fulltang/V0/administrator/medicament_list") 
})

//liste des emedicament
.get('/medicament_list',  async (req, res)=>{
    const list = await Medicament.findAll({order: [["id","DESC"]] })
    res.render("administrator/medicament-list",{medicament: list})    
})

// supprimer un medicament
.post('/medicament_list',  async (req, res)=>{

    const id=req.body.id
    const prescription= await Prescription.findOne({where: {medicamentId: id}})

    if(prescription){
        req.flash("negative","impossible de supprimer ce medicament car il a déja été utilisé dans le système")
        res.redirect("/fulltang/V0/administrator/medicament_list") 
    }
    else{
        await Medicament.destroy({ where: {id: id}})
        req.flash("positive","medicament supprimé avec succès")
        res.redirect("/fulltang/V0/administrator/medicament_list") 

    }
})



// editer un medicament
.get('/medicament/:id/edit',  async (req, res)=>{

    const id = req.params.id
    const list = await Medicament.findOne({where: {id:id}})

    if(list){
        res.render("administrator/edit-medicament",{medicament: list})
    }
    else{
        res.redirect("/fulltang/V0/administrator/medicament_list")
    }
        
})

.post('/medicament/:id/edit',  async (req, res)=>{

    const id = req.params.id
    await Medicament.update(req.body,{where: { id: id }})
    req.flash("positive","medicament modifié avec succès")
    res.redirect("/fulltang/V0/administrator/medicament_list") 

})












module.exports = router