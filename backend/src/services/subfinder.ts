import { spawn } from 'child_process';


export const subfinderModule = (domain: string): Promise<string[]> => {
    console.log("Subfinder here!")
    return new Promise((resolve, reject) => {
        let raw = '';
        const command = spawn('subfinder', ['-d', domain])
        command.stdout.on('data', (data) => {
            raw += data.toString();
        
        })

        command.on('close', () => {
            const results = raw.split('\n').filter(line => line.trim() !== '');
            resolve(results);
        });
    })
}