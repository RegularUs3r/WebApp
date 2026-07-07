import pool from "../database/database"


export const removeProgram = async(programName: string): Promise<void> => {
    await pool.query(
    `DELETE FROM response
     WHERE subdomain_id IN (SELECT id FROM subdomains WHERE p_name = (SELECT id FROM programname WHERE name = $1))
        OR link_id IN (SELECT id FROM links WHERE subdomain_id IN (SELECT id FROM subdomains WHERE p_name = (SELECT id FROM programname WHERE name = $1)))`,
    [programName]
)

await pool.query(
    `DELETE FROM links WHERE subdomain_id IN (SELECT id FROM subdomains WHERE p_name = (SELECT id FROM programname WHERE name = $1))`,
    [programName]
)

await pool.query(
    `DELETE FROM subdomains WHERE p_name = (SELECT id FROM programname WHERE name = $1)`,
    [programName]
)

await pool.query(
    `DELETE FROM hosts WHERE p_name = (SELECT id FROM programname WHERE name = $1)`,
    [programName]
)

await pool.query(
    `DELETE FROM notify WHERE p_name = (SELECT id FROM programname WHERE name = $1)`,
    [programName]
)

await pool.query(
    `DELETE FROM maps WHERE p_name = (SELECT id FROM programname WHERE name = $1)`,
    [programName]
)

// await pool.query(
//     `DELETE FROM jobs WHERE p_name = (SELECT id FROM programname WHERE name = $1)`,
//     [programName]
// )

await pool.query(
    `DELETE FROM programname WHERE name = $1`,
    [programName]
)

}