import { getBaseTargets, getNotifyConfig, getPname, getProgramName, getProgramNameByPname } from "../models/getStuffDB"
import { brancher } from "./distributor";
import cron from "node-cron";
import { notify } from "./notifier";

const activeCrons = new Map<string, ReturnType<typeof cron.schedule>>()

export const continuous = async(programName: string): Promise<void> => {
    const configdata = await getNotifyConfig(programName)
    if(configdata === undefined) return
    
    //Aprendi destructing com a I.A :)
    const { id, period, hook, options, p_name } = configdata
    const baseTargets = await getBaseTargets(programName)
    for(const target of baseTargets){
        const job = cron.schedule(period, async() => {
            console.log(`Current running ${period} ${target}`)
            try {
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

export const getActiveCrons = async (): Promise<string[]> => {
    var programName = []
    const targets = Array.from(activeCrons.keys())
    if(targets !== undefined){
        for(const target of targets){
            const p_name = await getPname(target)
            programName.push(String(await getProgramNameByPname(p_name)))

        }
    }
    console.log(programName)
    return programName
}