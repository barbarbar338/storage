import { status, ThrowableRouter } from "itty-router-extras";

export const shortenRouter = ThrowableRouter({
	base: "/shorten",
}).get("/", () => status(200, "Hello, world! (Shorten)"));
