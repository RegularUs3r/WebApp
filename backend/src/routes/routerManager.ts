import { Router } from "express";
import { addProgram, goLive, getData, getHooks} from "../controllers/controllers";
import { validator } from "../middleware/middle";


const router = Router()

router.post('/add-program', validator, addProgram)
router.get('/live', goLive)
router.get('/getdata', getData)
router.get('/gethooks', getHooks)


export default router;