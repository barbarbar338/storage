import { IsDefined, IsNumberString, IsUrl } from "class-validator";

export abstract class DeleteBookmarkDTO {
	@IsDefined()
	@IsNumberString()
	id: number;
}
