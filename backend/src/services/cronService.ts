import { getBaseTargets, getNotifyConfig, getProgramName } from "../models/getStuffDB"
import { brancher } from "./distributor";
import cron from "node-cron";
import { notify } from "./notifier";


export const continuous = async(): Promise<void> => {
    const programs = await getProgramName()
    for(const programname of programs){
        const configdata = await getNotifyConfig(programname)
        if(!configdata) continue
        
        //Aprendi destructing com a I.A :)
        const { id, period, hook, options, p_name } = configdata
        const baseTargets = await getBaseTargets(programname)
        for(const target of baseTargets){
            cron.schedule(period, async() => {
                try {
                    await notify("Process Runner", [`Running continuous enumeration for ${target}`], programname)
                    await brancher(programname, hook, period, [options], target, true)
                } catch(error) {
                    console.error(`Cron job failed for ${target}:`, error)
                }
            })
        }
        
    }
}