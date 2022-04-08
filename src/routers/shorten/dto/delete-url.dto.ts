import { IsDefined, IsNumberString } from "class-validator";

export abstract class DeleteURLDTO {
	@IsDefined()
	@IsNumberString()
	id: number;
}
