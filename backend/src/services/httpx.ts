import { spawn } from 'child_process';

export const httpxModule = async (sub: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        let raw = '';
        const command = spawn('httpx', ['-silent', '-sc', '-u', sub], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        command.stdout.on('data', (data) => {
            raw += data.toString()
        });
        command.on('close', () => {
            resolve([raw]);
        });
    });
}