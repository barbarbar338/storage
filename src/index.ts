import { router } from "./router";

declare global {
	const SUPABASE_URL: string;
	const SUPABASE_KEY: string;
	const USERNAME: string;
	const PASSWORD: string;
	const BASE_URL: string;
	const MAX_FILE_SIZE: string;
}

addEventListener("fetch", (event) =>
	event.respondWith(router.handle(event.request)),
);
