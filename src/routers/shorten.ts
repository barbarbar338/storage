import { status, ThrowableRouter } from "itty-router-extras";
import { Snowflake } from "../libs/snowflake";
import { supabaseClient } from "../libs/supabase";

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
	.post("/", async (req) => {
		const request = new Request(req.url, req);

		const mime = request.headers.get("content-type");
		if (!mime || !mime.startsWith("application/json"))
			return status(400, "invalid content type");

		const username = request.headers.get("X-Storage-Username");
		const password = request.headers.get("X-Storage-Password");
		if (username != USERNAME || password != PASSWORD)
			return status(401, "unauthorized");

		const json = await request.json<{
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

		console.log(codeExists);

		if (codeExists) return status(400, "code already exists");

		const payload = {
			url: json.url,
			code,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const { data: newUrl, error } = await supabaseClient
			.from("urls")
			.insert([payload])
			.single();

		console.log(newUrl);

		if (error) return status(500, "internal server error");

		return status(201, payload);
	});
