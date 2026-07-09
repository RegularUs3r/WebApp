import { getChannel } from "./connection"

export const consumeFromQueue = async (queue: string, onMessage: (content: string) => Promise<void>): Promise<void> => {
    const channel = getChannel()

    await channel.assertQueue(queue, { durable: true }) // must match producer's options exactly

    await channel.prefetch(1) // only hand this consumer 1 unacked message at a time

    channel.consume(queue, async (msg) => {
        if (!msg) return // broker cancelled the consumer (e.g. queue deleted)

        try {
            await onMessage(msg.content.toString())
            channel.ack(msg) // success — remove from queue
        } catch (err) {
            console.error(`Failed to process message from ${queue}:`, err)
            channel.nack(msg, false, false) // failure — drop it (or route to DLQ if configured)
        }
    })
}