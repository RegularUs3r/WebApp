import pool from "../database/database"
import { addSubdomainsWithCodeBluePrint, mapLinkBluePrint } from "../types/interfaces"

export const addProgramName = async(programName: string): Promise<void> => {
    console.log(programName)
    await pool.query(
        `INSERT INTO programname (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [programName]
    )
}

export const addBaseTargets = async(domain: string, programName: string): Promise<void> => {
    await pool.query(
        `INSERT INTO hosts (domain, p_name) VALUES ($1, (select id from programname where name = $2))`,
        [domain, programName]
    )
}

export const addSubdomainsWithCode = async(subdomain: string, status: number, programName: string, live: boolean): Promise<addSubdomainsWithCodeBluePrint | undefined> => {
    const result = await pool.query<addSubdomainsWithCodeBluePrint>(
        `INSERT INTO subdomains (subdomain, status, p_name) VALUES ($1, $2, (select id from programname where name = $3)) ON CONFLICT (subdomain) DO NOTHING RETURNING subdomain, status`,
        [subdomain, status, programName]
    )
    const data = result.rows.map(item => item)
    return data[0]
}

export const addResponse = async(response: string, subdomain: string, link: string): Promise<void> => {
    await pool.query(
        `INSERT INTO response (response_body, subdomain_id, link_id) VALUES ($1, (select id from subdomains where subdomain = $2), (select id from links where link = $3))`, // ON CONFLICT (subdomain_id) DO NOTHING`,
        [response, subdomain, link]
    )
}

export const addNotifyConfig = async(setcron: string, discord_hook: string, choice: string, program_name: string): Promise<void> => {
    await pool.query(
        `INSERT INTO notify (period, hook, options, p_name) VALUES ($1, $2, $3, (select id from programname where name = $4)) ON CONFLICT (p_name) DO NOTHING`,
        [setcron, discord_hook, choice, program_name]
    )
}

export const addLinks = async(link: string, subdomain: string): Promise<void> => {
    await pool.query(
        `INSERT INTO links (link, subdomain_id) VALUES ($1, (select id from subdomains where subdomain = $2)) ON CONFLICT (link) DO NOTHING`,
        [link, subdomain]
    )
}

export const updateResponse = async(newResponseBody: string, oldResponseBody: string, link: string): Promise<void> => {
    await pool.query(
        `UPDATE response set response_body = $1 where response_body = $2`,
        [newResponseBody, oldResponseBody]
    )
}

export const addMapLinks = async(maplink: string, programName: string): Promise<string | undefined> => {
    const result = await pool.query<mapLinkBluePrint>(
        `INSERT INTO maps (maplink, p_name) VALUES ($1, (select id from programname where name = $2)) ON CONFLICT (maplink) DO NOTHING RETURNING maplink`,
        [maplink, programName]
    )
    const data = result.rows.map(item => item.maplink)
    return data[0]
}

export const addSecret = async(secret: string): Promise<void> => {
    await pool.query(
        'INSERT INTO mfa (secret) VALUES ($1)',
        [secret]
    )
}