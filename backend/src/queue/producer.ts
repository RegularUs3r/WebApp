import { getChannel } from "./connection";

export const sendToQueue = async(queue: string, message: string): Promise<void> => {
    const channel = getChannel()

    await channel.assertQueue(queue, {durable: true})
    channel.sendToQueue(queue, Buffer.from(message))
}