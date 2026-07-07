import { Request, Response } from "express";
import path from 'path';
import app from "../app";


export const getMfa = async(req: Request, res: Response): Promise<void> => {
    if (req.session.authenticated === true) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, '..', '..', '..', 'frontend', 'index.html'));

}


export const validateMfa = async(req: Request, res: Response): Promise<void> => {
    const { code } = req.body
    const realOne = process.env.SECRET_PASS
    if(code === realOne){
        req.session.authenticated = true;
        res.json({ sucess: true})

    }else{
        res.status(403).json({"reason": "Wrong code!"})
    }

}