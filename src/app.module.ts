import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "src/app.controller";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limit";
import { PingModule } from "@routers/ping/ping.module";
import { AuthModule } from "@routers/auth/auth.module";
import { StorageModule } from "@routers/storage/storage.module";

@Module({
	imports: [
		RateLimiterModule.forRoot({
			points: 100,
			duration: 5,
			keyPrefix: "global",
		}),
		PingModule,
		AuthModule,
		StorageModule,
	],
	controllers: [AppController],
	providers: [{ provide: APP_GUARD, useClass: RateLimiterGuard }],
})
export class AppModule {}
