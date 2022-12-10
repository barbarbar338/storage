import { status, ThrowableRouter, withParams } from "itty-router-extras";
import { supabaseClient } from "./libs/supabase";
import { bookmarkRouter } from "./routers/bookmark";
import { shortenRouter } from "./routers/shorten";
import { storageRouter } from "./routers/storage";

declare global {
	const SUPABASE_URL: string;
	const SUPABASE_KEY: string;
	const USERNAME: string;
	const PASSWORD: string;
	const BASE_URL: string;
	const MAX_FILE_SIZE: string;
	const DISCORD_WEBHOOK_URL: string;
}

const router = ThrowableRouter()
	.all("/storage/*", (req) => storageRouter(req as Request)) // ? Why is this needed? IDK but it doesn't accepts the request type
	.all("/shorten/*", (req) => shortenRouter(req as Request))
	.all("/bookmark/*", (req) => bookmarkRouter(req as Request))
	.get("/", () => status(200, "Hello, world! (Main)"))
	.get("/:code", withParams, async (req) => {
		const code = req.params?.code as string;

		const { data: codeExists } = await supabaseClient
			.from("urls")
			.select("*")
			.eq("code", code)
			.single();
		if (!codeExists) return status(404, "not found");

		return Response.redirect(codeExists.url, 301);
	})
	.all("*", () => status(404, "not found")).handle;

addEventListener("fetch", (event: FetchEvent) =>
	event.respondWith(router(event.request)),
);
