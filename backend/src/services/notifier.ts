import { url } from "node:inspector";
import { getNotifyConfig } from "../models/getStuffDB"

type Sender = (info: string[], botname: string) => object[];

const subdomainEnumerator: Sender = (info, botname) => {
    const content = `https://${info.join(",").replace(/,/g, "\n")}`;
    return [{ username: botname, content: content }];
};

const process_runner: Sender = (info, botname) => {
    const content = `${info.join(",").replace(/,/g, "\n")}`;
    return [{ username: botname, content: content }];

};

const fuzzer: Sender = (info, botname) => {
    const target = info[0]?.split("SICK")[0]
    const content = `\`\`\`${info}\`\`\``;
    return [{ username: botname, content: content }];
};

const cname_dangler: Sender = (info, botname) => {
    const content = `${info.join(",").replace(/,/g, "\n")}` //.replace(/\n/g, "")}`;
    return [{ username: botname, content: content }];
};


const strategies: Record<string, Sender> = {
    "Subdomain Enumerator": subdomainEnumerator,
    "Process Runner": process_runner,
    "Fuzzer": fuzzer,
    "Cname Dangler": cname_dangler
};


export const notify = async(botname: string, info: string[], program_name: string): Promise<void> => {
    const configdata = await getNotifyConfig(program_name)
    if(configdata === undefined) return
    const { hook } = configdata
    // the box holds functions that take the info array and return payload object(s)

    const strategy = strategies[botname];
    if (strategy === undefined) {
        return;
    }

    const payloads = strategy(info, botname);
    for (const data of payloads) {
        await doRequest(data, hook);
    }
}

async function doRequest(data: object, hook: string){
        const response = await fetch(hook, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        console.log(data)
        console.log(response.statusText)
}


async function reDoRequest(data: object, hook: string){


}

// else if(botname === "File Differ"){
//         for(const messages of info){
//             if(messages.length < 4000 && messages.length > 21){
//                 const [name, message] = messages.split("SICK")
//                 if(message !== undefined) {
//                     if(message.length > 3){
//                         // message.replace('\\', '\\').replace('"', '\"')
//                         const data = {embeds:[{title: name, description: `\`\`\`${message}\`\`\``}]}
//                         await doRequest(data)
//                     }
//                 }
//             }

//         }
//     }