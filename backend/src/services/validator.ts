import { addSubdomainsWithCode } from "../models/addStuffDB"
import { linkExtractor } from "./extractor"
import { tryFetch } from "./fetch"
import { notify } from "./notifier"


export const prober = async(subdomains: string[], program_name: string, live: boolean): Promise<void> => {
    console.log(`Validating... ${live}`)
    for(const sub_domain of subdomains){
        //A I.A me ajudou com essa forma diferente de usar uma coisa se a outra falhar - nullish
        const response = await tryFetch(`http://${sub_domain}`) ?? await tryFetch(`https://${sub_domain}`)
        if(!response) continue
        if(live === false){
            await addSubdomainsWithCode(sub_domain,  response.status, program_name, live)
            await linkExtractor(sub_domain, live, program_name)
        }else{
            const data = await addSubdomainsWithCode(sub_domain,  response.status, program_name, live)
            await linkExtractor(sub_domain, live, program_name)
            if(!data) continue
            const {subdomain, status} = data
            await notify("Subdomain Enumerator", [subdomain + " - " +status], program_name)
        }
    }
}

