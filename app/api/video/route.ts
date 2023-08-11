import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Replicate from "replicate";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

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
            "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
            {
                input: {
                    prompt
                }
            }
        );
        if (!isPro) {
            await increaseApiLimit();
        }
        return NextResponse.json(output);
    } catch (error) {
        if (error instanceof Error) console.log("[VIDEO_ERROR]", error.message);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
