import Stripe from "stripe";

export const stripe: Stripe = new Stripe(process.env.SECRET_STRIPE_KEY!, {
    apiVersion: "2022-11-15",
    typescript: true
});
