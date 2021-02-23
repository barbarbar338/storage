import { IsDefined, Length } from "class-validator";

export abstract class LoginDTO {
	@IsDefined()
	public username: string;

	@Length(8, 32)
	public password: string;
}
