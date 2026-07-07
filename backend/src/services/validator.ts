import { addSubdomainsWithCode } from "../models/addStuffDB"
import { linkExtractor } from "./extractor"
import { tryFetch } from "./fetch"
import { notify } from "./notifier"


export const prober = async(subs: string[], program_name: string, live: boolean): Promise<void> => {
    for(const sub of subs){
        //A I.A me ajudou com essa forma diferente de usar uma coisa se a outra falhar - nullish
        const response = await tryFetch(`http://${sub}`) ?? await tryFetch(`https://${sub}`)
        if(response === undefined || response === null) return
        if(live === false){
            await addSubdomainsWithCode(sub,  response.status, program_name, live)
            await linkExtractor(sub, live, program_name)
        }else{
            const data = await addSubdomainsWithCode(sub,  response.status, program_name, live)
            await linkExtractor(sub, live, program_name)
            if(data === undefined) return
            const {subdomain, status} = data
            await notify("Subdomain Enumerator", [subdomain + " - " +status], program_name)
        }

    }
}

