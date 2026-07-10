export const c99 = async(domain: string): Promise<string[]> => {
    const subdomains: string[] = []
    try{
        const response = await fetch(`https://api.c99.nl/subdomainfinder?key=${process.env.KEY}&domain=${domain}`);
        if (!response.ok){
            throw new Error(`Request failed with status`)
        }
        
        const data = await response.json()
        if(!data.error){
            for (var i of data.subdomains){
                subdomains.push(i.subdomain)
            }
        }

    }catch(error){
        console.error('Missing some information')
    }
    return subdomains

};