import { spawn } from 'child_process';
import { readFileSync } from 'fs';


export const claudeMapParser = async(asset: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        let raw = '';
        let err = '';

        const command = spawn('claude', [
            '--model','claude-opus-5-5',
            '--dangerously-skip-permissions',
            '--print',
            '--output-format',
            'json',
            `INPUT: ${asset}
            # Role
            You extract HTTP endpoints from the provided input and output them as method + full URL. Nothing else.

            # Task
            For each endpoint found in the input:
            1. Extract the HTTP method and path.
            2. Replace the {host} placeholder with the actual host (provided or inferred from the input).
            3. Output one endpoint per line as: METHOD <host><path>

            # Rules
            - Output ONLY the extracted endpoints. No preamble, no explanation, no commentary.
            - If no endpoint is found, output exactly: NOTHING FOUND
            - Do not invent, guess, or complete partial endpoints — extract only what is present.

            # Format
            GET https://api.example.com/users/{id}
            POST https://api.example.com/login`
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

export const claudeCnameDangler = async(asset: string): Promise<string> => {
    const METHODOLOGY = readFileSync('/backend/ai/prompts/cname-methodology.md', 'utf8')
    return new Promise((resolve, reject) => {
        let raw = '';
        let err = '';

        const command = spawn('claude', [
            '--model','claude-opus-5-5',
            '--dangerously-skip-permissions',
            '--print',
            '--output-format', 'json',
            '--append-system-prompt', METHODOLOGY,
            '--add-dir', '/backend/ai/skills/subdomain-takeover',
            '--max-turns', '25',
            `INPUT: ${asset}\nReturn a single JSON object per the required schema.`
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