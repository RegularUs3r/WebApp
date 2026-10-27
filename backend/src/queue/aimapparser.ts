require('dotenv').config();

import { claudeMapParser } from "../services/claudemodule";
import { notify } from "../services/notifier";
import { connectRabbitMQ } from "./connection";
import { consumeFromQueue } from "./consumer";

const handler = async (content: string): Promise<void> => {
    const { mapURL, program_name } = JSON.parse(content);

    const result = await claudeMapParser(mapURL);
    await notify(`Map Finder`, [result+` - ${mapURL}`], program_name);
    console.log(`AI parsing finished for ${mapURL}`);
};

const start = async (): Promise<void> => {
    await connectRabbitMQ();
    await consumeFromQueue("ai_jobs", handler);
    console.log(`AI worker listening on ai_jobs`);
};

start().catch((err) => {
    console.error("AI worker failed to start:", err);
    process.exit(1);
});
