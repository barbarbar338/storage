import { BookmarkModel } from "@models/bookmark.model";
import { Body, Controller, Delete, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@routers/auth/auth.guard";
import { BookmarkService } from "@routers/bookmark/bookmark.service";
import { BookmarkDTO } from "@routers/bookmark/dto/bookmark.dto";
import { DeleteBookmarkDTO } from "@routers/bookmark/dto/delete-bookmark.dto";
import CONFIG from "src/config";

@Controller(CONFIG.API_VERSION + "/bookmark")
export class BookmarkController {
	constructor(private readonly bookmarkService: BookmarkService) {}

	@Post()
	@UseGuards(AuthGuard)
	async bookmark(
		@Body() bookmarkDTO: BookmarkDTO,
	): Promise<Storage.APIRes<number>> {
		return this.bookmarkService.bookmark(bookmarkDTO);
	}

	@Get()
	@UseGuards(AuthGuard)
	async getBookmarks(): Promise<Storage.APIRes<BookmarkModel[]>> {
		return this.bookmarkService.getBookmarks();
	}

	@Delete()
	@UseGuards(AuthGuard)
	async deleteBookmark(
		@Body() deleteBookmarkDTO: DeleteBookmarkDTO,
	): Promise<Storage.APIRes<number>> {
		return this.bookmarkService.deleteBookmark(deleteBookmarkDTO);
	}
}
