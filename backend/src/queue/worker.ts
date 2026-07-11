require('dotenv').config();

import { fuzzModule } from "../services/fuzz";
import { connectRabbitMQ } from "./connection"
import { consumeFromQueue } from "./consumer"

const handler = async (content: string) => {
    const { subdomain, program_name } = JSON.parse(content)

    fuzzModule(subdomain, program_name)
        .then(() => {
            console.log(`Fuzzing finished for ${subdomain}`)
            // e.g. mark job "done" in DB
        })
        .catch((err) => {
            console.error(`Fuzzing failed for ${subdomain}:`, err)
            // e.g. mark job "failed" in DB
        })

    // no await above — handler resolves almost instantly, so consumer.ts's channel.ack(msg) fires right away
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