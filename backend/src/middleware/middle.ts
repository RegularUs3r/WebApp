import { Request, Response, NextFunction } from "express";

const badChars = ["!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "[", "\\", "]", "^", "_", "`", "{", "|", "}", "~"]

export const validator = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const program_name = req.body.program_name
    const discord_hook = req.body.discord_hook
    const setcron = req.body.setcron
    const choice = req.body.choice
    const target = req.body.target
    
    if(program_name === undefined || discord_hook === undefined || setcron === undefined || choice === undefined || target === undefined){
        res.status(400).json({"reason": "Missing param"})
    }else{
        const decision = await letterValidator(program_name, discord_hook, setcron, choice, target, res)
        if(decision === true){
            next()
        }
    }
    
}


const letterValidator = async(program_name: string, discord_hook: string, setcron: string, choice: string, target: string, res: Response): Promise<boolean> => {
    let result: boolean = true;
    for (const badChar of badChars){
        if(badChar === "-" || badChar === "." || badChar === ","){

        }else{
            if(target.includes(badChar)){
                result = false
                defaultResponse(res)
            }
        }

        if(badChar === ":" || badChar === "/" || badChar === "-" || badChar === "." || badChar === "_"){

        }else{
            if(discord_hook.includes(badChar)){
                result = false
                defaultResponse(res)
            }
        }

        if(badChar === "-"){

        }else{
            if(program_name.includes(badChar)){
                result = false
                defaultResponse(res)
            }
        }

        if(setcron.includes(badChar)){
            result = false
            defaultResponse(res)   
        }

        if(choice.includes(badChar)){
            result = false
            defaultResponse(res)
        }
    }
    return result
}

function defaultResponse(res: Response){
    return res.status(400).json({"reason": `Invalid input`})
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (req.session.authenticated === true) {
        next();
        return;
    }
    if (req.method !== 'GET' || req.path.startsWith('/api/')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    res.redirect('/mfa');
    console.log("/mfa")
    
}
