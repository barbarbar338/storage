import { IsOptional, IsUrl } from "class-validator";

export abstract class ShortenDTO {
	@IsUrl()
	url: string;

	@IsOptional()
	code: string;
}
