import { Module } from "@nestjs/common";
import { AuthModule } from "@routers/auth/auth.module";
import { StorageController } from "@routers/storage/storage.controller";
import { StorageService } from "@routers/storage/storage.service";
import { Snowflake } from "@snowflake";
import { Webhook } from "@webhook";

@Module({
	imports: [AuthModule],
	controllers: [StorageController],
	providers: [StorageService, Snowflake, Webhook],
})
export class StorageModule {}
