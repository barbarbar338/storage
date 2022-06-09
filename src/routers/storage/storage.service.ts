import {
	Injectable,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import CONFIG from "src/config";
import { Snowflake } from "@snowflake";
import { lookup } from "mime-types";
import { FastifyReply } from "fastify";
import { storageBucket } from "@supabase";
import { MessageAttachment } from "discord.js";
import { Webhook } from "@webhook";

@Injectable()
export class StorageService {
	constructor(
		private readonly snowflake: Snowflake,
		private readonly webhook: Webhook,
	) {}

	public returnPing(): Storage.APIRes<null> {
		return {
			statusCode: HttpStatus.OK,
			message: "Pong!",
			data: null,
		};
	}

	private decideFolder(mime: string): string {
		if (mime.startsWith("video")) return "videos";
		else if (mime.startsWith("image")) return "images";
		else if (mime.startsWith("image/gif")) return "gifs";
		else return "others";
	}

	public async uploadFile(
		file: Storage.MultipartFile,
	): Promise<Storage.APIRes<unknown>> {
		const buffer = await file.toBuffer();
		const fileName = file.filename;
		const extension = fileName.split(".").pop();
		const id = this.snowflake.generate();
		const mime = lookup(extension) || "applicaton/octet-stream";
		const path = `${this.decideFolder(mime)}/${id}.${extension}`;

		const { error } = await storageBucket.upload(path, buffer, {
			contentType: mime,
		});
		if (error) throw new InternalServerErrorException(error.message);

		if (this.webhook.canSend()) {
			const size = Buffer.byteLength(buffer) / 1024 / 1024;
			const attachment = new MessageAttachment(buffer, path);
			await this.webhook.send({
				content: `${CONFIG.SITE_URL}/${CONFIG.API_VERSION}/storage/uploads/${path} uploaded`,
				files: [size < 8 ? attachment : null],
			});
		}

		return {
			statusCode: HttpStatus.CREATED,
			message: "File uploaded",
			data: `${CONFIG.SITE_URL}/${CONFIG.API_VERSION}/storage/uploads/${path}`,
		};
	}

	public async getFile(filePath: string, rep: FastifyReply): Promise<void> {
		const { error, data } = await storageBucket.download(filePath);
		if (error) throw new NotFoundException(error.message);

		const mime = lookup(filePath) || "applicaton/octet-stream";
		rep.header("Content-Type", mime).send(
			Buffer.from(await data.arrayBuffer()),
		);
	}
}
