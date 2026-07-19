import { spawn } from 'child_process';
import { notify } from './notifier';

interface OnTheFlyEntry {
    payloads: string[];
}

export const fuzzModule = (domain: string, program_name: string): Promise<void> => {
    const onTheFly: Record<string, OnTheFlyEntry> = {};
    const target: string[] = []
    return new Promise((resolve, reject) => {
        let raw = '';
        let leftover = ''
        const command = spawn('ffuf', ['-json', '-ic', '-r', '-t', '4', '-p', '0.1', '-u', `https://${domain}/FUZZ`, '-w', '/home/ubuntu/webapp2/frontend/foo.txt', '-mc', 'all'])
        command.stdout.on('data', (data) => {
            leftover += data.toString()
            const lines = leftover.split('\n')
            leftover = lines.pop() ?? ''

            for(const line of lines){
                const intel = JSON.parse(line)
                const size = String(intel.length)
                if (!(size in onTheFly)) {
                    onTheFly[size] = { payloads: [] }
                }

                const splitUrl = intel.url.split('/')
                const url = splitUrl.slice(0, -1).join('/')
                const payload = splitUrl[splitUrl.length - 1]
                if (!target.includes(url)) {
                    target.push(url)
                }
                onTheFly[size]?.payloads.push(payload)
            }

        })

        command.stderr.on('data', (data) => {
            console.error(`ffuf stderr [${domain}]:`)
        })

        command.on('close', async(code) => {
            if (code !== 0) {
                console.error(`ffuf exited with code ${code} for ${domain}`)
            }
            for (const [key, payload] of Object.entries(onTheFly)) {
                const dictsLength = payload.payloads.length
                console.log(`Dict length - ${dictsLength}`)
                if (dictsLength <= 10) {
                    for(const word of payload.payloads){
                        const data = target[0]+"/"+word + " - " + key
                        console.log(data)
                        await notify("Fuzzer", [data], program_name)
                    }
                    
                }
            }
            resolve()

        });
    })
    
}