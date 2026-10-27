require('dotenv').config();

import { claudeCnameDangler } from "../services/claudemodule";
import { notify } from "../services/notifier";
import { connectRabbitMQ } from "./connection";
import { consumeFromQueue } from "./consumer";

const handler = async (content: string): Promise<void> => {
    const { target, program_name } = JSON.parse(content);

    const result = await claudeCnameDangler(target);
    await notify(`Cname Dangler`, [result+` - ${target}`], program_name);
    console.log(`Finished checking for dangling cname ${target}`);
};

const start = async (): Promise<void> => {
    await connectRabbitMQ();
    await consumeFromQueue("Cname Dangler", handler);
    console.log(`AI dangling cname check listening on ai_cname`);
};

start().catch((err) => {
    console.error("AI cname check failed to start:", err);
    process.exit(1);
});
