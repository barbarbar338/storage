import { Controller, Get, HttpStatus, Param, Redirect } from "@nestjs/common";
import { ShortenService } from "@routers/shorten/shorten.service";

@Controller()
export class AppController {
	constructor(private readonly shortenService: ShortenService) {}

	@Get()
	public returnPing(): Storage.APIRes<null> {
		return {
			statusCode: HttpStatus.OK,
			message: "Pong!",
			data: null,
		};
	}

	@Get(":code")
	@Redirect("/", HttpStatus.NOT_FOUND)
	public async redirect(
		@Param("code") code: string,
	): Promise<{ url: string }> {
		return this.shortenService.redirect(code);
	}
}
