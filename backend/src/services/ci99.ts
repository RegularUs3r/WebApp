export const c99 = async(domain: string): Promise<string[]> => {
    const subdomains: string[] = []
    try{
        const response = await fetch(`https://api.c99.nl/subdomainfinder?key=${process.env.KEY}&domain=${domain}`);
        if (!response.ok){
            throw new Error(`Request failed with status`)
        }
        
        const data = await response.json()
        try{
            for (var i of data.subdomains){
                console.log(i)
                subdomains.push(i.subdomain)
            }
        }catch(error){
            console.error("c99: unexpected response shape", error)
        }

    }catch(error){
        console.error('Failed to fetch user details:', error)
        throw error;
    }
    return subdomains

};