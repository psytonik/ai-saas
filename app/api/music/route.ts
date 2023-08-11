import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Replicate from "replicate";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { AxiosError } from "axios";

const replicate: Replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!
});
export const POST = async (req: Request, _: Response) => {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;
        if (!userId) {
            return new NextResponse("Not Authorized", { status: 401 });
        }

        if (!prompt) {
            return new NextResponse("Prompt is Required", { status: 400 });
        }
        const freeTrial: boolean = await checkApiLimit();
        const isPro: boolean = await checkSubscription();
        if (!freeTrial && !isPro) {
            return new NextResponse("Free Trial has expired", { status: 402 });
        }
        const output = await replicate.run(
            "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
            {
                input: {
                    prompt_a: prompt
                }
            }
        );
        if (!isPro) {
            await increaseApiLimit();
        }
        return NextResponse.json(output);
    } catch (error) {
        if (error instanceof AxiosError || error instanceof Error)
            console.log("[MUSIC_ERROR]", error.message);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
