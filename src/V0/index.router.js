const express = require('express')
const router = express.Router()
const ReceptionistRouter = require('./routes/profiles/receptionistRouter')
const DoctorRouter = require('./routes/profiles/doctorRouter')
const LabTechnicianRouter = require('./routes/profiles/labtechnicianRouter')
const CashierRouter = require('./routes/profiles/cashierRouter')
const SpecialistRouter = require('./routes/profiles/specalistRouter')
const AdminRouter = require('./routes/admin/adminRouter')

router.use((req,res,next)=>{
    if(req.session.user==undefined){ 
      res.redirect("/fulltang/login")
    }else{
        res.locals.user=req.session.user
        next()
    }
});

router.use('/receptionnist', ReceptionistRouter)
router.use('/doctor' , DoctorRouter)
router.use('/specialist' , SpecialistRouter)
router.use('/cashier' , CashierRouter)
router.use('/labtechnician' , LabTechnicianRouter)
router.use('/administrator' , AdminRouter)


router.get('/', (req,res)=>{
    res.send(` Welcome to fulltang V0`)
})

//// deconnexion
router.get('/deconnexion', (req,res)=>{

    req.session.destroy()
    res.redirect("/fulltang/login")
})

module.exports = router