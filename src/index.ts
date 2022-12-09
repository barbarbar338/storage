import { status, ThrowableRouter } from "itty-router-extras";
import { shortenRouter } from "./routers/shorten";
import { storageRouter } from "./routers/storage";

declare global {
	const SUPABASE_URL: string;
	const SUPABASE_KEY: string;
	const USERNAME: string;
	const PASSWORD: string;
	const BASE_URL: string;
	const MAX_FILE_SIZE: string;
}

const router = ThrowableRouter()
	.all("/storage/*", (req) => storageRouter.handle(req))
	.all("/shorten/*", (req) => shortenRouter.handle(req))
	.get("/", () => status(200, "Hello, world! (Main)"))
	.all("*", () => status(404, "not found"));

addEventListener("fetch", (event) =>
	event.respondWith(router.handle(event.request)),
);
