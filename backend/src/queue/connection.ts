import amqp, { ChannelModel, Channel } from "amqplib";

let connection: ChannelModel | undefined;
let channel: Channel | undefined;

export const connectRabbitMQ = async (): Promise<void> => {
    if (channel) return;
    connection = await amqp.connect(`${process.env.RABBITMQ_CONNECTION}`)
    connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err)
    })
    connection.on("close", () => {
        console.error("RabbitMQ connection closed")
        connection = undefined
        channel = undefined
    })

    channel = await connection.createChannel()
};

export const getChannel = (): Channel => {
    if (!channel) throw new Error("RabbitMQ channel not initialized — call connectRabbitMQ() first")
    return channel
}