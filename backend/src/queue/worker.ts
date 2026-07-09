require('dotenv').config();

import { getProgramName } from "../models/getStuffDB";
import { fuzzModule } from "../services/fuzz";
import { connectRabbitMQ } from "./connection"
import { consumeFromQueue } from "./consumer"

const start = async () => {
    await connectRabbitMQ()
    const names = await getProgramName()
    for(const name of names){
        await consumeFromQueue(name, async (content) => {
        const payload = JSON.parse(content)
        const {subdomain, program_name} = payload
        fuzzModule(subdomain, program_name)
    })

    }
    console.log("Worker listening...")
}

start().catch((err) => {
    console.error("Worker failed to start:", err)
    process.exit(1)
})