import {
	Injectable,
	HttpStatus,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import CONFIG from "src/config";
import { Snowflake } from "@snowflake";
import { lookup } from "mime-types";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class StorageService {
	constructor(private readonly snowflake: Snowflake) {}

	private readonly Supabase = createClient(
		CONFIG.SUPABASE.public_url,
		CONFIG.SUPABASE.public_anon_key,
	);
	private SupabaseBucket = this.Supabase.storage.from("uploads");

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

		const { error } = await this.SupabaseBucket.upload(path, buffer, {
			contentType: mime,
		});
		if (error) throw new InternalServerErrorException(error.message);

		return {
			statusCode: HttpStatus.CREATED,
			message: "File uploaded",
			data: `${CONFIG.SITE_URL}/${CONFIG.API_VERSION}/storage/uploads/${path}`,
		};
	}

	public async getFile(filePath: string): Promise<Buffer> {
		const { error, data } = await this.SupabaseBucket.download(filePath);
		if (error) throw new NotFoundException(error.message);

		return Buffer.from(await data.arrayBuffer());
	}
}
