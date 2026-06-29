import { getBaseTargets, getNotifyConfig, getProgramName } from "../models/getStuffDB"
import { brancher } from "./distributor";
import cron from "node-cron";
import { notify } from "./notifier";
import { addCronState } from "../models/addStuffDB";

const activeCrons = new Map<string, ReturnType<typeof cron.schedule>>()

export const continuous = async(programName: string): Promise<void> => {
    const configdata = await getNotifyConfig(programName)
    if(configdata === undefined) return
    
    //Aprendi destructing com a I.A :)
    const { id, period, hook, options, p_name } = configdata
    const baseTargets = await getBaseTargets(programName)
    console.log(baseTargets)
    for(const target of baseTargets){
        console.log(target)
        const job = cron.schedule(period, async() => {
            console.log("Cron running!")
            console.log(`Current period ${period}`)
            await addCronState(job.getStatus(), programName)
            try {
                // await notify("Process Runner", [`Running continuous enumeration for ${target}`], programName)
                await brancher(programName, hook, period, [options], target, true)
            } catch(error) {
                console.error(`Cron job failed for ${target}:`, error)
            }
        })
        activeCrons.set(target, job)
    }
        
}

export const stopCron = async(programName: string): Promise<void> => {
    const baseTargets = await getBaseTargets(programName)
    console.log(baseTargets)
    for(const target of baseTargets){
        activeCrons.get(target)?.stop()
        activeCrons.delete(target)

    }
}