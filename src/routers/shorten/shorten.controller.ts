import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@routers/auth/auth.guard";
import CONFIG from "src/config";
import { DeleteURLDTO } from "./dto/delete-url.dto";
import { ShortenDTO } from "./dto/shorten.dto";
import { ShortenService } from "./shorten.service";

@Controller(CONFIG.API_VERSION + "/shorten")
export class ShortenController {
	constructor(private readonly shortenService: ShortenService) {}

	@Post()
	@UseGuards(AuthGuard)
	public async shorten(
		@Body() shortenDTO: ShortenDTO,
	): Promise<Storage.APIRes<string>> {
		return this.shortenService.shorten(shortenDTO);
	}

	@Get("all")
	@UseGuards(AuthGuard)
	public async getAll(): Promise<Storage.APIRes<string[]>> {
		return this.shortenService.getAll();
	}

	@Delete()
	@UseGuards(AuthGuard)
	public async delete(
		@Body() deleteURLDTO: DeleteURLDTO,
	): Promise<Storage.APIRes<boolean>> {
		return this.shortenService.delete(deleteURLDTO);
	}
}
