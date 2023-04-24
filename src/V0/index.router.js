const express = require('express')
const router = express.Router()
const ReceptionistRouter = require('./routes/profiles/receptionistRouter')
const DoctorRouter = require('./routes/profiles/doctorRouter')
const LabTechnicianRouter = require('./routes/profiles/labtechnicianRouter')
const CashierRouter = require('./routes/profiles/cashierRouter')
const SpecialistRouter = require('./routes/profiles/specalistRouter')

router.use('/receptionnist', ReceptionistRouter)
 router.use('/doctor' , DoctorRouter)
 router.use('/specialist' , SpecialistRouter)
router.use('/cashier' , CashierRouter)
router.use('/labtechnician' , LabTechnicianRouter)


router.get('/', (req,res)=>{
    res.send(` Welcome to fulltang V0`)
})

module.exports = router