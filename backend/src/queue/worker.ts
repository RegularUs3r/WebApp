require('dotenv').config();

import { fuzzModule } from "../services/fuzz";
import { connectRabbitMQ } from "./connection"
import { consumeFromQueue } from "./consumer"

const handler = async (content: string) => {
    const { subdomain, program_name } = JSON.parse(content)
    await fuzzModule(subdomain, program_name)
}

const start = async () => {
    await connectRabbitMQ()
    await consumeFromQueue("fuzz_jobs", handler)
    console.log(`Worker listening on fuzz_jobs`)
}

start().catch((err) => {
    console.error("Worker failed to start:", err)
    process.exit(1)
})