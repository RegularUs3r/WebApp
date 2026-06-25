import { Router } from "express";
import { getMfa, validateMfa } from "../controllers/authControllers";

const authrouter = Router()

authrouter.get('/mfa',getMfa)
authrouter.post('/validateMFA', validateMfa)

export default authrouter