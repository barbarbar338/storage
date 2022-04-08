import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@routers/auth/auth.guard";
import { StorageService } from "@routers/storage/storage.service";
import { UploadGuard } from "@routers/storage/upload.guard";
import { FastifyReply, FastifyRequest } from "fastify";
import CONFIG from "src/config";
import { File } from "./file.decorator";

@Controller(CONFIG.API_VERSION + "/storage")
export class StorageController {
	constructor(private readonly storageService: StorageService) {}
	@Get()
	public returnPing(): Storage.APIRes<null> {
		return this.storageService.returnPing();
	}

	@Get("uploads/*")
	public async getFile(
		@Req() req: FastifyRequest,
		@Res() rep: FastifyReply,
	): Promise<void> {
		const filePath = req.url.split("/").slice(4).join("/");

		await this.storageService.getFile(filePath, rep);
	}

	@Post("upload")
	@UseGuards(UploadGuard, AuthGuard)
	public uploadFile(
		@File() file: Storage.MultipartFile,
	): Promise<Storage.APIRes<unknown>> {
		return this.storageService.uploadFile(file);
	}
}
