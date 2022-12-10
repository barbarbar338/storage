import { status, ThrowableRouter } from "itty-router-extras";
import { Snowflake } from "../libs/snowflake";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";
import { contentType } from "../middlewares/contentType";

export const shortenRouter = ThrowableRouter({
	base: "/shorten",
})
	.get("/", () => status(200, "Hello, world! (Shorten)"))
	.get("/all", async () => {
		const { data: urls, error } = await supabaseClient
			.from("urls")
			.select("*");

		if (error) return status(500, "internal server error");

		return status(201, urls);
	})
	.post("/", auth, contentType("application/json"), async (req) => {
		const json = await req.json<{
			url: string;
			code: string;
		}>();

		if (!json.url) return status(400, "no url");

		const { data: url } = await supabaseClient
			.from("urls")
			.select("*")
			.eq("url", json.url)
			.single();

		if (url) return status(201, url);

		const code = json.code || Snowflake.generate();

		const { data: codeExists } = await supabaseClient
			.from("urls")
			.select("*")
			.eq("code", code)
			.single();

		if (codeExists) return status(400, "code already exists");

		const payload = {
			url: json.url,
			code,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const { error } = await supabaseClient
			.from("urls")
			.insert([payload])
			.single();

		if (error) return status(500, "internal server error");

		await fetch(DISCORD_WEBHOOK_URL, {
			body: JSON.stringify({
				content: `${json.url} shortened`,
				embeds: [
					{
						fields: [
							{
								name: "Long URL",
								value: json.url,
							},
							{
								name: "Short URL",
								value: `${BASE_URL}/${code}`,
							},
						],
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
