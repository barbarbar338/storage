import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "@routers/auth/auth.module";
import { BookmarkService } from "@routers/bookmark/bookmark.service";
import { BookmarkModel } from "src/models/bookmark.model";
import { BookmarkController } from "@routers/bookmark/bookmark.controller";
import { Webhook } from "@webhook";

@Module({
	imports: [SequelizeModule.forFeature([BookmarkModel]), AuthModule],
	controllers: [BookmarkController],
	providers: [BookmarkService, Webhook],
	exports: [SequelizeModule],
})
export class BookmarkModule {}
