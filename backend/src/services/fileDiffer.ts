import { diffLines } from 'diff';
import { notify } from './notifier';
import { updateResponse } from '../models/addStuffDB';
export const checkFile = async(old_response_body: string, response_body: string, link: string, program_name: string): Promise<void> => {
    const changes: string[] = []
    
    const differences = diffLines(Buffer.from(old_response_body, 'base64').toString('utf-8') , response_body)
    Object.entries(differences).forEach(([key, value]) => {
        if(value["added"] === true){
            // console.log(`Linhas adicionada ${value["value"]} - ${link}`)
            changes.push(`LINHAS ADICIONADAS-${link} SICK ${value["value"]}`)
        }
    })
    if(changes.length > 0){
        console.log("Changes is bigger!")
        console.log(changes)
        const newResponseBody = Buffer.from(response_body, 'utf8').toString('base64')
        await updateResponse(newResponseBody, old_response_body, link)
        await notify("File Differ", changes, program_name)
    }
}