import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BookmarkModel } from "@models/bookmark.model";

@Injectable()
export class BookmarkService {
	constructor(
		@InjectModel(BookmarkModel)
		private readonly bookmarkModel: typeof BookmarkModel,
	) {}
}
