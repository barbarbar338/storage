import { status, ThrowableRouter } from "itty-router-extras";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";
import { contentType } from "../middlewares/contentType";

export const bookmarkRouter = ThrowableRouter({
	base: "/bookmark",
})
	.get("/", () => status(200, "Hello, world! (Bookmark)"))
	.get("/all", async () => {
		const { data: bookmarks, error } = await supabaseClient
			.from("bookmarks")
			.select("*");

		if (error) return status(500, "internal server error");

		return status(201, bookmarks);
	})
	.post("/", auth, contentType("application/json"), async (req) => {
		const json = await req.json<{
			url: string;
			title: string;
			description: string;
			imageUrl: string;
		}>();

		if (!json.url || !json.imageUrl || !json.title || !json.description)
			return status(400, "empty fields");

		const { data: url } = await supabaseClient
			.from("bookmarks")
			.select("*")
			.eq("url", json.url)
			.single();

		if (url) return status(201, url);

		const payload = {
			url: json.url,
			title: json.title,
			description: json.description,
			imageUrl: json.imageUrl,
		};

		const { error } = await supabaseClient
			.from("bookmarks")
			.insert([payload])
			.single();

		if (error) return status(500, "internal server error");

		await fetch(DISCORD_WEBHOOK_URL, {
			body: JSON.stringify({
				content: `${json.url} bookmarked`,
				embeds: [
					{
						author: {
							name: json.title,
							icon_url: json.imageUrl,
						},
						description: json.description,
						color: 7506394,
					},
				],
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		return status(201, payload);
	}).handle;
