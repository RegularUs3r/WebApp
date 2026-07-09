require('dotenv').config();

import app from "./app";
import { connectRabbitMQ } from "./queue/connection";
import { sendToQueue } from "./queue/producer";

const port = process.env.PORT

const start = async() => {
    await connectRabbitMQ()

    app.listen(port, () => {
        console.log(`App listening on ${port}`)
    })
}

start().catch((err) => {
    console.log("Failedto start server:", err)
    process.exit(1)
})