import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { auth } from "@clerk/nextjs";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const config: Configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
});
const openAi: OpenAIApi = new OpenAIApi(config);

export const POST = async (req: Request, _: Response) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt, amount = 1, resolution = "512x512" } = body;
        if (!userId) {
            return new NextResponse("Not Authorized", { status: 401 });
        }
        if (!config.apiKey) {
            return new NextResponse("Open AI Api Key not provided", {
                status: 500
            });
        }
        if (!prompt) {
            return new NextResponse("Prompt is Required", { status: 400 });
        }
        if (!resolution) {
            return new NextResponse("Resolution is Required", { status: 400 });
        }
        if (!amount) {
            return new NextResponse("Amount is Required", { status: 400 });
        }

        const freeTrial: boolean = await checkApiLimit();
        const isPro: boolean = await checkSubscription();
        if (!freeTrial && !isPro) {
            return new NextResponse("Free Trial has expired", { status: 402 });
        }

        const response = await openAi.createImage({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
        });
        if (!isPro) {
            await increaseApiLimit();
        }
        return NextResponse.json(response.data.data);
    } catch (error) {
        if (error instanceof Error) console.log("[IMAGE_ERROR]", error.message);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
