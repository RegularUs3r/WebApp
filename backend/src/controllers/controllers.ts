import { Request, Response, NextFunction } from "express";
import { brancher } from "../services/distributor";
import { continuous } from "../services/cronService";
import { getNotifyConfig, getProgramName, getSubdomains } from "../models/getStuffDB";
import { stripTypeScriptTypes } from "module";

const cronOptions: { [key: string]: string } = {
        '1M':  '* * * * *',
        '1H':  '0 */1 * * *',
        '2H':  '0 */2 * * *',
        '3H':  '0 */3 * * *',
        '4H':  '0 */4 * * *',
        '5H':  '0 */5 * * *',
        '6H':  '0 */6 * * *',
        '7H':  '0 */7 * * *',
        '8H':  '0 */8 * * *',
        '9H':  '0 */9 * * *',
        '10H': '0 */10 * * *',
        '11H': '0 */11 * * *',
        '12H': '0 */12 * * *',
};

export const addProgram = async(req: Request, res: Response): Promise<void> => {
    const program_name = req.body.program_name
    const discord_hook = req.body.discord_hook
    const setcron = req.body.setcron
    const choice = req.body.choice
    const target = req.body.target
    if(cronOptions[setcron] !== undefined){
        if(target.includes(",")){
            await Promise.all(target.split(",").map(async (value: string) => {
                await Promise.all([brancher(program_name, discord_hook, cronOptions[setcron] ?? "", choice, value, false)])
                try{res.json({"message": "OK!"})}catch(error){}
            }))
            try{res.json({"message": "OK!"})}catch(error){}
        }else{
            await Promise.all([brancher(program_name, discord_hook, cronOptions[setcron], choice, target, false)])
            res.json({"message": "OK!"})
        }
    } else {
        res.status(400).json({"message": "Invalid cron option"})
    }
}

export const goLive = async(req: Request, res: Response): Promise<void> => {
    await continuous()
    res.json({"message": "Activated"})
}

export const getData = async(req: Request, res: Response): Promise<void> => {
    var data: object = {}
    const names = await getProgramName()
    for(const name of names){
        const subs = await getSubdomains(name)
        // I.A ajudou com o spread
        data = { ...data, [name]: subs }
        console.log(data)
    }
    res.json({data})
}

export const getHooks = async(req: Request, res: Response): Promise<void> => {
    var data: object = {}
    const names = await getProgramName()
    for(const name of names){
        const config = await getNotifyConfig(name)
        data = { ...data, [name]: config }
        console.log(data)

    }
    res.json({data})
    
}