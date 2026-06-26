import { addProgramName, addBaseTargets, addNotifyConfig } from "../models/addStuffDB"
import { c99 } from "./ci99"
import { notify } from "./notifier"
import { subfinderModule } from "./subfinder"
import { prober } from "./validator"



export const brancher = async(program_name: string, discord_hook: string, setcron: string, choice: string[], target: string, live: boolean): Promise<void> => {
    if(live === false){
        await addProgramName(program_name)
        await addBaseTargets(target, program_name)
        await addNotifyConfig(setcron, discord_hook, choice[0] ?? "", program_name)
    }
    if(choice[0]?.includes("c99")){
        console.log("Ready to go c99")
        const subdomains = await c99(target)
        await prober(subdomains, program_name, live)
        await notify("Process Runner", [`c99 enumeration has been finished for ${target}`], program_name)
    }
    if(choice[0]?.includes("subfinder")){
        console.log("Ready to go subfinder")
        const subdomains = await subfinderModule(target)
        await prober(subdomains, program_name, live)
        await notify("Process Runner", [`Subfinder enumeration has been finished for ${target}`], program_name)
    }


}