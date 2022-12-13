import {
	BadRequestException,
	Controller,
	Get,
	HTTPStatus,
	InternalServerErrorException,
	Middleware,
	NotFoundException,
	PayloadTooLargeException,
	Post,
	type APIRes,
} from "sidra";
import { decideFolder } from "../libs/decideFolder";
import { Snowflake } from "../libs/snowflake";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";
import { contentType } from "../middlewares/contentType";

@Controller("/storage")
export class StorageController {
	@Get()
	get(): APIRes<string> {
		return {
			data: "storage",
			message: "Hello, world!",
			statusCode: HTTPStatus.OK,
		};
	}

	@Get("uploads/*")
	async getUploads(req: Request): Promise<Blob> {
		const { pathname } = new URL(req.url);
		const path = pathname.slice("/storage/uploads/".length);

		const { error, data } = await supabaseClient.storage
			.from("uploads")
			.download(path);

		if (error) throw new NotFoundException(`${path} not found`);

		return data;
	}

	@Middleware(auth, contentType("multipart/form-data"))
	@Post("/upload")
	async postUpload(req: Request): Promise<APIRes<unknown>> {
		const formData = await req.formData();

		if (!formData.has("file")) throw new BadRequestException("no file");

		const file = formData.get("file");
		if (!(file instanceof File)) throw new BadRequestException("no file");

		if (file.size > parseInt(MAX_FILE_SIZE))
			throw new PayloadTooLargeException("file too large");

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

		if (error)
			throw new InternalServerErrorException("internal server error");

		await fetch(DISCORD_WEBHOOK_URL, {
			body: JSON.stringify({
				content: `${BASE_URL}/storage/uploads/${path} uploaded`,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		return {
			data: `${BASE_URL}/storage/uploads/${path}`,
			message: "file uploaded",
			statusCode: HTTPStatus.CREATED,
		};
	}
}
