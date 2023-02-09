import { Handle } from "sidra";
import { AppController } from "./controllers/app.controller";
import { BookmarkController } from "./controllers/bookmark.controller";
import { ShortenController } from "./controllers/shorten.controller";
import { StorageController } from "./controllers/storage.controller";

declare global {
	const SUPABASE_URL: string;
	const SUPABASE_KEY: string;
	const USERNAME: string;
	const PASSWORD: string;
	const BASE_URL: string;
	const MAX_FILE_SIZE: string;
	const DISCORD_WEBHOOK_URL: string;
}

const handler = Handle(
	[StorageController, ShortenController, BookmarkController, AppController],
	{
		allowedHeaders: "Content-Type, Authorization",
		methods: "GET, POST, OPTIONS",
		origin: "*",
		maxAge: 86400,
	},
);

addEventListener("fetch", (event: FetchEvent) =>
	event.respondWith(handler(event.request)),
);
