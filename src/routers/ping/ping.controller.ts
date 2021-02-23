import { Controller, Get } from "@nestjs/common";
import { PingService } from "@routers/ping/ping.service";

@Controller("ping")
export class PingController {
	constructor(private readonly pingService: PingService) {}
	@Get()
	public returnPing(): Storage.APIRes<null> {
		return this.pingService.returnPing();
	}
}
