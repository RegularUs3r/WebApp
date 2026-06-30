import pool from "../database/database"
import { CronDataBluePrint, responseBodyBluePrint } from "../types/interfaces"

export const getProgramName = async(): Promise<string[]> => {
    const results = await pool.query(
        'SELECT name FROM programname'
    )
    const data = results.rows.map(item => item.name)
    return data
}

//A.I helped with this interface return type
export const getNotifyConfig = async(program_name: string): Promise<CronDataBluePrint | undefined> => {
                                    //Didn't know I could do this
    const results = await pool.query<CronDataBluePrint>(
        `SELECT * FROM notify where p_name = (select id from programname where name = $1)`,
        [program_name]
    )
    const data = results.rows.map(item => item)
    return data[0]
}

export const getBaseTargets = async(program_name: string): Promise<string[] | any> => {
    const results = await pool.query(
        `SELECT domain FROM hosts where p_name = (select id from programname where name = $1)`,
        [program_name]
    )

    const data = results.rows.map(item => item.domain)
    return data
}

export const getResponse = async(link: string): Promise<string> => {
    const results = await pool.query<responseBodyBluePrint>(
        `SELECT response_body FROM response where link_id = (select id from links where link = $1)`,
        [link]
    )
    const data = results.rows.map(item => item.response_body)
    return data[0] ?? ""
}

export const getSubdomains = async(program_name: string): Promise<string[]> => {
    const results = await pool.query(
        `SELECT subdomain, status FROM subdomains where p_name = (select id from programname where name = $1)`,
        [program_name]
    )
    const data = results.rows.map(item => item)
    return data
}

export const checkLinksAgainstSubdomains = async(link: string): Promise<boolean> => {
    const result = await pool.query(
        `SELECT EXISTS(SELECT 1 FROM subdomains WHERE subdomain = $1)`,
        [link]
    )
    const data = result.rows.map(item => item.exists)
    return data[0]
}

export const getCronState = async(programName: string): Promise<any> => {
    console.log(programName)
    const results = await pool.query(
        'SELECT status FROM jobs WHERE p_name = (select id from programname where name = $1)',
        [programName]
    )
    const data = results.rows.map(item => item)
    console.log(data)
    return data
}