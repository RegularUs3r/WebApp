import { spawn } from 'child_process';


export const claudeModule = async(asset: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        let raw = '';
        let err = '';

        const command = spawn('claude', [
            '--model','claude-opus-5-5',
            '--dangerously-skip-permissions',
            '--print',
            '--output-format',
            'json',
            `Analyze this public know and authorized source map file ${asset}. The "sourcesContent" field contains original source. Do NOT write, create, or modify any file. The returned output must be as follows only: METHOD https://{host}/PATH
            replace placeholder for the actual value.
            If there is no routes reeturn (_NOTHING FGOUND_). 
            DO NOT PROVIDE ADDITIONAL EXPLANETIONS!!!`
        ], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        command.stdout.on('data', (data) => {
            raw += data.toString();
        });

        command.stderr.on('data', (data) => {
            err += data.toString();
        });

        command.on('error', (spawnError) => {
            reject(spawnError);
        });

        command.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`claude exited with code ${code}: ${err}`));
                return;
            }

            try {
                const parsed = JSON.parse(raw);
                resolve(parsed.result);
            } catch (parseError) {
                reject(new Error(`Failed to parse output: ${(parseError as Error).message}\nRaw: ${raw}`));
            }
        });
    });
}