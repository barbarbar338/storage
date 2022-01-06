import { IsDefined, IsUrl } from "class-validator";

export abstract class BookmarkDTO {
	@IsUrl()
	url: string;

	@IsDefined()
	title: string;

	@IsDefined()
	description: string;

	@IsUrl()
	imageUrl: string;
}
