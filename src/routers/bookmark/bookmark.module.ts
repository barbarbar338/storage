import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BookmarkService } from "@routers/bookmark/bookmark.service";
import { BookmarkModel } from "src/models/bookmark.model";
import { BookmarkController } from "./bookmark.controller";

@Module({
	imports: [SequelizeModule.forFeature([BookmarkModel])],
	controllers: [BookmarkController],
	providers: [BookmarkService],
})
export class BookmarkModule {}
