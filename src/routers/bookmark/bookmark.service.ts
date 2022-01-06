import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BookmarkModel } from "@models/bookmark.model";
import { BookmarkDTO } from "@routers/bookmark/dto/bookmark.dto";
import { DeleteBookmarkDTO } from "@routers/bookmark/dto/delete-bookmark.dto";

@Injectable()
export class BookmarkService {
	constructor(
		@InjectModel(BookmarkModel)
		private readonly bookmarkModel: typeof BookmarkModel,
	) {}

	public async bookmark({
		description,
		imageUrl,
		title,
		url,
	}: BookmarkDTO): Promise<Storage.APIRes<number>> {
		const bookmark = await this.bookmarkModel.create({
			description,
			imageUrl,
			title,
			url,
		});

		return {
			statusCode: HttpStatus.OK,
			message: "Bookmark successfully created",
			data: bookmark.id,
		};
	}

	public async getBookmarks(): Promise<Storage.APIRes<BookmarkModel[]>> {
		const bookmarks = await this.bookmarkModel.findAll();

		return {
			statusCode: HttpStatus.OK,
			message: "Bookmarks successfully fetched",
			data: bookmarks,
		};
	}

	public async deleteBookmark({
		id,
	}: DeleteBookmarkDTO): Promise<Storage.APIRes<number>> {
		const bookmark = await this.bookmarkModel.findByPk(id);

		if (!bookmark) throw new NotFoundException("Bookmark not found");

		await bookmark.destroy();

		return {
			statusCode: HttpStatus.OK,
			message: "Bookmark successfully deleted",
			data: null,
		};
	}
}
