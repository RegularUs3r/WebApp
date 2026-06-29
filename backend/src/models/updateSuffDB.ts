import pool from "../database/database"

export const updateSetts = async(program_name: string, discord_hook: string, choice: string, setcron: string): Promise<void> => {
    await pool.query(
        'UPDATE notify SET hook = $2, options = $3, period = $4 WHERE p_name = (select id from programname where name = $1)',
        [program_name, discord_hook, choice, setcron]
    )
}