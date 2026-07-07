import { Router } from "express";
import { addProgram, getData, getHooks, cronState, killJob, fireJob, updateSets, deleteProgram } from "../controllers/controllers";
import { validator } from "../middleware/middle";


const router = Router()


router.get('/api/getdata', getData)
router.get('/api/gethooks', getHooks)
router.get('/api/killjob/:program', killJob)

router.post('/api/add-program', validator, addProgram)
router.post('/api/cron', cronState)
router.post('/api/fireJob', fireJob)

router.patch('/api/updatesetts', updateSets)

router.delete('/api/program/:program', deleteProgram)



export default router;