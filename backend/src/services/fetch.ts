
export const tryFetch = async(url: string): Promise<Response|null> => {
    const USER_AGENT = { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0' }
    try {
        const result = await fetch(url, { method: 'GET', headers: USER_AGENT })
        if(result.status === 404){
            return null
        }
        return result
    } catch {
        return null
    }
}