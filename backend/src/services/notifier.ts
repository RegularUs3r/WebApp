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
    const content = `${info.join(",").replace(/,/g, "\n")}`;
    return [{ username: botname+` - ${target}`, content: content }];
};

const cname_dangler: Sender = (info, botname) => {
    const content = `${info.join(",").replace(/,/g, "\n")}`;
    return [{ username: botname, content: content }];
};


const mapfinder: Sender = (info, botname) => {
    const firstEmbed: string[] = [];
    const secondEmbed: string[] = [];
    try {
        for (const line of String(info).split("\n")) {
            const currentLen = firstEmbed.reduce((sum, s) => sum + s.length + 1, 0);
            if (currentLen + line.length + 1 < 4090) {
                firstEmbed.push(line);
            } else {
                secondEmbed.push(line);
            }
        }
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
    if(secondEmbed.length > 3){
        // const data1 = { content: botname, embeds: [ { description: `${String(firstEmbed).replace(/,/g, "\n")}` }, { description: `${String(secondEmbed).replace(/,/g, "\n")}` }],};
        const data1 = `${String(firstEmbed).replace(/,/g, "\n")}`
        const data2 = `${String(secondEmbed).replace(/,/g, "\n")}`
        return [{ username: botname, embeds: [{ description: data1.replace(/```/g, "") }, {description: data2.replace(/```/g, "")}]}]
    
    }else{
        // const data = { content: botname, embeds: [ { description: `${String(firstEmbed).replace(/,/g, "\n")}` } ],};
        const data = `${String(firstEmbed).replace(/,/g, "\n")}`
        return [{ username: botname, embeds: [{ description: data.replace(/```/g, "") }]}]
    }
};


const strategies: Record<string, Sender> = {
    "Subdomain Enumerator": subdomainEnumerator,
    "Process Runner": process_runner,
    "Fuzzer": fuzzer,
    "Map Finder": mapfinder,
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