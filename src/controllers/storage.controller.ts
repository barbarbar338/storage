import { AwsClient } from "aws4fetch";
import {
	type APIRes,
	BadRequestException,
	Controller,
	Get,
	HTTPStatus,
	Middleware,
	NotFoundException,
	Post,
} from "sidra";
import { Env } from "../env";
import { decideFolder } from "../libs/decideFolder";
import { Snowflake } from "../libs/snowflake";
import { auth } from "../middlewares/auth";
import { contentType } from "../middlewares/contentType";

export function createStorageController(env: Env, aws: AwsClient) {
	@Controller("/storage")
	class StorageController {
		@Get()
		get(): APIRes<string> {
			return {
				message: "Ping!",
				data: "Pong!",
				statusCode: HTTPStatus.OK,
			};
		}

		@Get("uploads/*")
		async getUploads(req: Request): Promise<Blob> {
			const { pathname } = new URL(req.url);
			const path = pathname.slice("/storage/uploads/".length);

			const fullPath = `${env.MINIO_CONSOLE_HOST}/${env.MINIO_BUCKET_NAME}/${path}`;
			const response = await aws.fetch(fullPath, {
				method: "GET",
			});

			if (!response.ok) throw new NotFoundException("file not found");

			const file = await response.blob();
			return file;
		}

		@Middleware(auth(env), contentType("multipart/form-data"))
		@Post("/upload")
		async postUpload(req: Request): Promise<APIRes<string>> {
			const formData = await req.formData();
			if (!formData.has("file")) throw new BadRequestException("no file");

			const file = formData.get("file") as unknown as File;
			if (!file || typeof file == "string" || !(file instanceof File))
				throw new BadRequestException("no file");

			const extMatch = file.name.match(/\.([0-9a-z]+)(?:[?#]|$)/i);
			const extension = extMatch ? `.${extMatch[1]}` : "";
			const id = Snowflake.generate();
			const path = `${decideFolder(file.type)}/${id}${extension}`;

			const stream = file.stream ? file.stream() : file;
			const fullPath = `${env.MINIO_CONSOLE_HOST}/${env.MINIO_BUCKET_NAME}/${path}`;
			const upload = await aws.fetch(fullPath, {
				method: "PUT",
				body: stream,
				headers: {
					"Content-Type": file.type,
				},
			});

			if (!upload.ok) throw new BadRequestException("upload failed");

			https: return {
				data: `${env.MINIO_CONSOLE_HOST}/${env.MINIO_BUCKET_NAME}/${path}`,
				message: "file uploaded",
				statusCode: HTTPStatus.CREATED,
			};
		}
	}

	return StorageController;
}
