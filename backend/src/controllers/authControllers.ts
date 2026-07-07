import { Request, Response } from "express";
import path from 'path';
import { OTP } from 'otplib';
import * as QRCode from 'qrcode';
import { addSecret } from "../models/addStuffDB";
import { getSecret } from "../models/getStuffDB";


const otp = new OTP({ strategy: 'totp'})
export const getMfa = async(req: Request, res: Response): Promise<void> => {

    const storedSecret = await getSecret()
    if(storedSecret === null){
        const secret = otp.generateSecret()
        await addSecret(secret)
        
        const uri = otp.generateURI({
            issuer: 'AssetMonitor',
            label: 'Dev',
            secret: secret
        });
        const terminalQR: string = await QRCode.toString(uri, {type: 'terminal'})
        console.log(terminalQR)
    }

    if (req.session.authenticated === true) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, '..', '..', '..', 'frontend', 'index.html'));

}


export const validateMfa = async(req: Request, res: Response): Promise<void> => {
    const { code } = req.body
    // const realOne = process.env.SECRET_PASS
    const storedSecret = await getSecret()
    const isValid = await otp.verify({
        token: code,
        secret: storedSecret
    })
    if(isValid.valid){
        req.session.authenticated = true;
        res.json({ sucess: true})
    }else{
        res.status(403).json({"reason": "Wrong code!"})
    }

}