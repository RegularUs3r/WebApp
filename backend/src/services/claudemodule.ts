import { spawn } from 'child_process';


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
            You determine whether a given domain has a dangling CNAME (a CNAME
            record pointing to a target that is unregistered / unclaimed / no
            longer resolves — i.e. potentially vulnerable to subdomain takeover).

            # Task
            For the provided domain:
            1. Resolve its CNAME chain.
            2. Determine whether the final target is dangling (unresolvable,
            NXDOMAIN, or points to a deprovisioned service).
            3. Answer with a single: YES or NO

            # Rules
            - Output ONLY "YES" or "NO" — no explanation.
            - If you lack the tools/access needed to resolve DNS for this domain,
            do not guess. Instead output exactly: TOOLS MISSING: <what you need>
            - A "YES" means evidence of a dangling CNAME was found. If records
            resolve cleanly, answer "NO".

            # When unsure
            If DNS resolves but you cannot confirm the target's claim status,
            answer "NO" (do not report a vulnerability you haven't confirmed).`
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