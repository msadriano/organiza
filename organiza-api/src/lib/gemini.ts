import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_APY_KEY);

export { geminiClient };
