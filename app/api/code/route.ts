import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { auth } from "@clerk/nextjs";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
const config: Configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
});
const openAi: OpenAIApi = new OpenAIApi(config);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content:
        "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations"
};
export const POST = async (req: Request, _: Response) => {
    try {
        const { messages } = await req.json();
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Not Authorized", { status: 401 });
        }
        if (!config.apiKey) {
            return new NextResponse("Open AI Api Key not provided", {
                status: 500
            });
        }
        if (!messages) {
            return new NextResponse("Message is Required", { status: 400 });
        }

        const freeTrial: boolean = await checkApiLimit();
        const isPro: boolean = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Free Trial has expired", { status: 402 });
        }

        const response = await openAi.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });
        if (!isPro) {
            await increaseApiLimit();
        }
        return NextResponse.json(response.data.choices[0].message);
    } catch (error) {
        if (error instanceof Error) console.log("[CODE_ERROR]", error.message);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
