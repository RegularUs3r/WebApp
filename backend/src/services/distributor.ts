import { addProgramName, addBaseTargets, addNotifyConfig } from "../models/addStuffDB"
import { c99 } from "./ci99"
import { subfinderModule } from "./subfinder"
import { prober } from "./validator"



export const brancher = async(program_name: string, discord_hook: string, setcron: string, choice: string[], target: string, live: boolean): Promise<void> => {
    if(live === false){
        await addProgramName(program_name)
        await addBaseTargets(target, program_name)
        await addNotifyConfig(setcron, discord_hook, choice[0] ?? "", program_name)
    }
    if(choice[0]?.includes("c99")){
        const subdomains = await c99(target)
        await prober(subdomains, program_name, live)
        //this throws JavaScript heap out of Memory
        // await Promise.all(subdomains.map(sub => prober(sub, program_name, live)))
    }
    if(choice[0]?.includes("subfinder")){
        const subdomains = await subfinderModule(target)
        await prober(subdomains, program_name, live)
        //this throws JavaScript heap out of Memory
        // await Promise.all(subdomains.map(sub => prober(sub, program_name, live)))
    }


}