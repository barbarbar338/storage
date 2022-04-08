import { URLModel } from "@models/url.model";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "@routers/auth/auth.module";
import { Snowflake } from "@snowflake";
import { ShortenController } from "./shorten.controller";
import { ShortenService } from "./shorten.service";

@Module({
	imports: [SequelizeModule.forFeature([URLModel]), AuthModule],
	controllers: [ShortenController],
	providers: [ShortenService, Snowflake],
	exports: [SequelizeModule, ShortenService],
})
export class ShortenModule {}
