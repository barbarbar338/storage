import { IsDefined, IsNumberString } from "class-validator";

export abstract class DeleteBookmarkDTO {
	@IsDefined()
	@IsNumberString()
	id: number;
}
