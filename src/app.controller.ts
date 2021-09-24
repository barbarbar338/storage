import { Controller, Get, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
	@Get()
	public returnPing(): Storage.APIRes<null> {
		return {
			statusCode: HttpStatus.OK,
			message: "Pong!",
			data: null,
		};
	}
}
