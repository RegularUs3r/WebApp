import { getNotifyConfig } from "../models/getStuffDB"


export const notify = async(botname: string, info: string[], program_name: string): Promise<void> => {
    const configdata = await getNotifyConfig(program_name)
    if(configdata === undefined) return
    const { id, period, hook, options, p_name } = configdata
    if(botname === "Subdomain Enumerator"){
        const data = {username: botname, content: `https://${info.join(",").replace(/,/g, "\n")}`}
        await doRequest(data)
    }else if(botname === "File Differ"){
        for(const messages of info){
            if(messages.length < 4000 && messages.length > 21){
                const [name, message] = messages.split("SICK")
                if(message !== undefined) {
                    if(message.length > 3){
                        // message.replace('\\', '\\').replace('"', '\"')
                        const data = {embeds:[{title: name, description: `\`\`\`${message}\`\`\``}]}
                        await doRequest(data)
                    }
                }
            }

        }
    }else if(botname === "Map Finder"){
        const data = {username: botname, content: `${info.join(",").replace(/,/g, "\n")}`}
        await doRequest(data)

    }else if(botname === "Process Runner"){
        const data = {username: botname, content: `${info.join(",").replace(/,/g, "\n")}`}
        await doRequest(data)
    }
    async function doRequest(data: object){
        const response = await fetch(hook, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
        })
    }
}