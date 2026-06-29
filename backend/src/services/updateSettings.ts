import { updateSetts } from "../models/updateSuffDB"

export const update = async(program_name: string, discord_hook: string, choice: string, setcron: string): Promise<void> => {
    await updateSetts(program_name, discord_hook, choice, setcron)
}