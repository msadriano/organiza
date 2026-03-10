import Anthropic from "@anthropic-ai/sdk";

const iaClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export { iaClient };
