export interface addSubdomainsWithCodeBluePrint {
    "subdomain": string,
    "status": string
}

export interface CronDataBluePrint {
        "id": string,
        "period": string,
        "hook": string,
        "options": string,
        "p_name":string

    }

export interface responseBodyBluePrint {
    "response_body": string,
    "subdomain_id": string,
    "subdomain": string
}