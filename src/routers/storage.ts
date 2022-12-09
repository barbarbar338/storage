import { status, ThrowableRouter } from "itty-router-extras";
import { decideFolder } from "../libs/decideFolder";
import { Snowflake } from "../libs/snowflake";
import { supabaseClient } from "../libs/supabase";

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
	.post("/upload", async (req) => {
		const request = new Request(req.url, req);

		const mime = request.headers.get("content-type");
		if (!mime || !mime.startsWith("multipart/form-data"))
			return status(400, "invalid content type");

		const username = request.headers.get("X-Storage-Username");
		const password = request.headers.get("X-Storage-Password");
		if (username != USERNAME || password != PASSWORD)
			return status(401, "unauthorized");

		const formData = await request.formData();

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

		return status(201, `${BASE_URL}/storage/uploads/${path}`);
	});
