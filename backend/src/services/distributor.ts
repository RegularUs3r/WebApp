import { addProgramName, addBaseTargets, addNotifyConfig } from "../models/addStuffDB"
import { c99 } from "./ci99"
import { notify } from "./notifier"
import { subfinderModule } from "./subfinder"
import { prober } from "./validator"



export const brancher = async(program_name: string, discord_hook: string, setcron: string, choice: string, target: string, live: boolean): Promise<void> => {
    if(live === false){
        await addProgramName(program_name)
        await addBaseTargets(target, program_name)
        await addNotifyConfig(setcron, discord_hook, choice, program_name)
    }
    console.log([choice][0])
    if([choice][0]?.includes("c99")){
        const subdomains = await c99(target)
        await prober(subdomains, program_name, live)
        await notify("Process Runner", ["c99 enumeration has been finished!"], program_name)
    }
    if([choice][0]?.includes("subfinder")){
        const subdomains = await subfinderModule(target)
        console.log(subdomains)
        await prober(subdomains, program_name, live)
        await notify("Process Runner", ["Subfinder enumeration has been finished!"], program_name)
    }


}