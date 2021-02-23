import { Injectable, HttpStatus } from "@nestjs/common";

@Injectable()
export class PingService {
	public returnPing(): Storage.APIRes<null> {
		return {
			statusCode: HttpStatus.OK,
			message: "Pong!",
			data: null,
		};
	}
}
