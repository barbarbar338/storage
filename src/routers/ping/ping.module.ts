import { Module } from "@nestjs/common";
import { PingController } from "@routers/ping/ping.controller";
import { PingService } from "@routers/ping/ping.service";

@Module({
	controllers: [PingController],
	providers: [PingService],
})
export class PingModule {}
