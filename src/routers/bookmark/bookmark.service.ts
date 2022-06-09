import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BookmarkModel } from "@models/bookmark.model";
import { BookmarkDTO } from "@routers/bookmark/dto/bookmark.dto";
import { DeleteBookmarkDTO } from "@routers/bookmark/dto/delete-bookmark.dto";
import { Webhook } from "@webhook";
import { MessageEmbed } from "discord.js";

@Injectable()
export class BookmarkService {
	constructor(
		@InjectModel(BookmarkModel)
		private readonly bookmarkModel: typeof BookmarkModel,
		private readonly webhook: Webhook,
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

		if (this.webhook.canSend()) {
			const embed = new MessageEmbed()
				.setAuthor({
					name: title,
					iconURL: imageUrl,
					url,
				})
				.setDescription(description)
				.setColor("BLURPLE");

			await this.webhook.send({
				content: `${url} bookmarked`,
				embeds: [embed],
			});
		}

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
