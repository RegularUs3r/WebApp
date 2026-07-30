import amqp, { ChannelModel, Channel } from "amqplib";

let connection: ChannelModel | undefined;
let channel: Channel | undefined;

const setupChannel = async (conn: ChannelModel): Promise<void> => {
    channel = await conn.createChannel()

    channel.on("close", () => {
        channel = undefined
        if (conn !== connection) return // the connection itself died; connection.on("close") already handles recovery
        console.error("RabbitMQ channel closed unexpectedly — recreating channel")
        setupChannel(conn).catch((err) => console.error("Failed to recreate channel:", err))
    })

    channel.on("error", (err) => {
        console.error("RabbitMQ channel error:", err)
    })
}

const scheduleReconnect = (): void => {
    setTimeout(() => {
        connectRabbitMQ().catch((err) => {
            console.error("Reconnect failed, retrying in 5s:", err)
            scheduleReconnect()
        })
    }, 5000)
}

export const connectRabbitMQ = async (): Promise<void> => {
    if (channel) return
    connection = await amqp.connect(`${process.env.RABBITMQ_CONNECTION}`)

    connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err)
    })
    connection.on("close", () => {
        console.error("RabbitMQ connection closed — reconnecting...")
        connection = undefined
        channel = undefined
        scheduleReconnect()
    })

    await setupChannel(connection)
};

export const getChannel = (): Channel => {
    if (!channel) throw new Error("RabbitMQ channel not initialized — call connectRabbitMQ() first")
    return channel
}