import { responseParser } from './responseReader';
import { tryFetch } from './fetch';
import { addLinks, addMapLinks, addResponse } from '../models/addStuffDB';
import { checkLinksAgainstSubdomains, getResponse } from '../models/getStuffDB';
import { checkFile } from './fileDiffer';
import { notify } from './notifier';

export const linkExtractor = async(subdomain: string, live: boolean, program_name: string): Promise<void> => {
    const excludedFiles = [".png", ".jpg", ".gif", ".webp", ".jpeg"]
    const links: string[] = []
    const response = await tryFetch(`http://${subdomain}`) ?? await tryFetch(`https://${subdomain}`)
    
    if(response === null) return
    const html = await response.text()
    const DOM = await responseParser(html)
    const tags = DOM.querySelectorAll('*')
    await Promise.all(tags.map(async tag => {
        const link = tag.getAttribute("src")
        if(link !== undefined){
            if(!link.includes("../")){
                if(link.startsWith("http")){
                    links.push(link.toLowerCase())
                }else if(link.startsWith("/")){
                    if(link.slice(0, 2) === "//"){
                        const r_link = link.replace(link.slice(0, 2), "")
                        const prepared_link = `https://${subdomain}/${r_link}`
                        links.push(prepared_link.toLowerCase())

                    }else if(link.slice(0, 1) === "/"){
                        const r_link = link.replace(link.slice(0, 1), "")
                        const prepared_link = `https://${subdomain}/${r_link}`
                        links.push(prepared_link.toLowerCase())

                    }else{}
                }else{
                    const prepared_link = `https://${subdomain}/${link}`
                    links.push(prepared_link.toLowerCase())
                }
            }
        }
    }))
    //A I.A ajudou com esse pattern já que meu if else não estava funcionando
    const pattern = new RegExp(excludedFiles.join("|"), "i")
    const cleaned = links.filter(item => !pattern.test(item))
    await linkParser(cleaned, subdomain, live, program_name)
    
}


const linkParser = async(links: string[], subdomain: string, live: boolean, program_name: string): Promise<void> => {
    for(var link of links){
        const processedLink = String(link.split("?")[0])
        const check = await checkLinksAgainstSubdomains(processedLink.replace("https://", "").replace("/", ""))
        if (check === false){
            if(processedLink.includes("google") || processedLink.includes("getbootstrap") || processedLink.includes("github") || processedLink.includes("fontawesome") || processedLink.includes("jquery.com")){   
            }else{
                await addLinks(processedLink, subdomain)
                const r = await tryFetch(`${processedLink}.map`) ?? await tryFetch(processedLink)
                const txt_response = r?.clone()
                if(!r) continue
                if(!txt_response) continue
                if(r.url.endsWith(".map")){
                    try{
                        const response = await r.json()
                        const sources = response["sources"]
                        if(sources){
                            const data = await addMapLinks(r.url, program_name) ?? ""
                            await notify("Map Finder", [data], program_name)
                        }
                    }catch(error){
                        console.error("Not a .map file")
                    }
                }
                try{
                    const data = await txt_response.text()
                    if(live === true){
                        const old_response_body = await getResponse(processedLink)
                        await checkFile(old_response_body, data, processedLink, program_name)
                    }else{
                        const encodedData = Buffer.from(data, 'utf8').toString('base64')
                        await addResponse(encodedData, subdomain, processedLink)
                    }
                }catch(error){
                    console.error("Something went wrong", error)
                }
                
            }
            
        }
    }
    
}