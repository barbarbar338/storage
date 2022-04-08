import { URLModel } from "@models/url.model";
import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Snowflake } from "@snowflake";
import CONFIG from "src/config";
import { DeleteURLDTO } from "./dto/delete-url.dto";
import { ShortenDTO } from "./dto/shorten.dto";

const URL_REGEX =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gim;

@Injectable()
export class ShortenService {
	constructor(
		@InjectModel(URLModel)
		private readonly urlModel: typeof URLModel,
		private readonly snowflake: Snowflake,
	) {}

	public async shorten({
		code,
		url,
	}: ShortenDTO): Promise<Storage.APIRes<string>> {
		if (!url.match(URL_REGEX)) throw new BadRequestException("Invalid URL");
		if (code) {
			const urlExists = await this.urlModel.findOne({ where: { code } });
			if (urlExists)
				throw new BadRequestException("Custom code already exists");
		} else code = this.snowflake.generate();

		const urlModel = await this.urlModel.create({
			url,
			code,
		});

		return {
			message: "URL successfully shortened",
			data: urlModel.code,
			statusCode: HttpStatus.CREATED,
		};
	}

	public async getAll(): Promise<Storage.APIRes<string[]>> {
		const models = await this.urlModel.findAll();
		return {
			statusCode: HttpStatus.OK,
			message: "URLs successfully fetched",
			data: models.map((model) => `${CONFIG.SITE_URL}/${model.code}`),
		};
	}

	public async delete({
		id,
	}: DeleteURLDTO): Promise<Storage.APIRes<boolean>> {
		const model = await this.urlModel.findByPk(id);
		if (!model) throw new BadRequestException("URL not found");
		await model.destroy();
		return {
			statusCode: HttpStatus.OK,
			message: "URL successfully deleted",
			data: true,
		};
	}

	public async redirect(code: string): Promise<{ url: string }> {
		const model = await this.urlModel.findOne({ where: { code } });
		if (!model) throw new BadRequestException("URL not found");
		return {
			url: model.url,
		};
	}
}
