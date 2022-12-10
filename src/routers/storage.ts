import { status, ThrowableRouter } from "itty-router-extras";
import { decideFolder } from "../libs/decideFolder";
import { Snowflake } from "../libs/snowflake";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";
import { contentType } from "../middlewares/contentType";

export const storageRouter = ThrowableRouter({
	base: "/storage",
})
	.get("/", () => status(200, "Hello, world! (Storage)"))
	.get("/uploads/*", async (req) => {
		const { pathname } = new URL(req.url);
		const path = pathname.slice("/storage/uploads/".length);

		const { error, data } = await supabaseClient.storage
			.from("uploads")
			.download(path);
		if (error) return status(404, `${path} not found`);

		return new Response(data);
	})
	.post("/upload", auth, contentType("multipart/form-data"), async (req) => {
		const formData = await req.formData();

		if (!formData.has("file")) return status(400, "no file");

		const file = formData.get("file");
		if (!(file instanceof File)) return status(400, "no file");

		if (file.size > parseInt(MAX_FILE_SIZE))
			return status(400, "max size exceeded");

		const extension = (file.name.match(/\.([0-9a-z]+)(?:[?#]|$)/) || [
			"",
		])[0];
		const id = Snowflake.generate();
		const path = `${decideFolder(file.type)}/${id}${extension}`;

		const { error } = await supabaseClient.storage
			.from("uploads")
			.upload(path, file, {
				contentType: file.type,
			});

		if (error) return status(500, "internal server error");

		await fetch(DISCORD_WEBHOOK_URL, {
			body: JSON.stringify({
				content: `${BASE_URL}/storage/uploads/${path} uploaded`,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		return status(201, `${BASE_URL}/storage/uploads/${path}`);
	}).handle;
