import { Router } from "express";
import { addProgram, goLive, getData, getHooks} from "../controllers/controllers";
import { validator } from "../middleware/middle";


const router = Router()

router.post('/api/add-program', validator, addProgram)
router.get('/api/live', goLive)
router.get('/api/getdata', getData)
router.get('/api/gethooks', getHooks)


export default router;