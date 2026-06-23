import { HTMLElement, parse } from 'node-html-parser';

export const responseParser = async(response: string): Promise<HTMLElement> => {
    const DOM = parse(response)
    return DOM
}