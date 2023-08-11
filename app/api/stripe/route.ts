import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismaDb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");
export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Not Authenticated", { status: 401 });
        }
        const userSubscription = await prismaDb.userSubscription.findUnique({
            where: { userId }
        });
        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl
            });
            return new NextResponse(JSON.stringify({ url: stripeSession.url }));
        }
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited Ai Generations"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId
            }
        });
        return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    } catch (e) {
        if (e instanceof Error) console.log(e.message, "[STRIPE_ERROR]");
        return new NextResponse(e as string, { status: 500 });
    } finally {
    }
}
