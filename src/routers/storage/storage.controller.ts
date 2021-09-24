import { Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@routers/auth/auth.guard";
import { StorageService } from "@routers/storage/storage.service";
import { UploadGuard } from "@routers/storage/upload.guard";
import { FastifyRequest } from "fastify";
import { File } from "./file.decorator";

@Controller("storage")
export class StorageController {
	constructor(private readonly storageService: StorageService) {}
	@Get()
	public returnPing(): Storage.APIRes<null> {
		return this.storageService.returnPing();
	}

	@Get("uploads/*")
	public async getFile(@Req() req: FastifyRequest): Promise<Buffer> {
		const filePath = req.url
			.split("/")
			.slice(4)
			.join("/");

		return this.storageService.getFile(filePath);
	}

	@Post("upload")
	@UseGuards(UploadGuard, AuthGuard)
	public uploadFile(
		@File() file: Storage.MultipartFile,
	): Promise<Storage.APIRes<unknown>> {
		return this.storageService.uploadFile(file);
	}
}
