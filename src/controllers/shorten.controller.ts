import {
	BadRequestException,
	ConflictException,
	Controller,
	Get,
	HTTPStatus,
	InternalServerErrorException,
	Middleware,
	Post,
	type APIRes,
} from "sidra";
import { Snowflake } from "../libs/snowflake";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";
import { contentType } from "../middlewares/contentType";

@Controller("/shorten")
export class ShortenController {
	@Get()
	get(): APIRes<string> {
		return {
			data: "shorten",
			message: "Hello, world!",
			statusCode: HTTPStatus.OK,
		};
	}

	@Get("all")
	async getAll(): Promise<APIRes<unknown>> {
		const { data: urls, error } = await supabaseClient
			.from("urls")
			.select("*");

		if (error)
			throw new InternalServerErrorException("internal server error");

		return {
			data: urls,
			message: "Get all urls",
			statusCode: HTTPStatus.OK,
		};
	}

	@Middleware(auth, contentType("application/json"))
	@Post()
	async post(req: Request): Promise<APIRes<unknown>> {
		const json = await req.json<{
			url: string;
			code: string;
		}>();

		const code = json.code || Snowflake.generate();

		if (["bookmark", "shorten", "storage"].includes(code))
			throw new BadRequestException("invalid code [reserved]");

		if (!json.url) throw new BadRequestException("invalid request body");

		const { data: url } = await supabaseClient
			.from("urls")
			.select("*")
			.eq("url", json.url)
			.single();

		if (url)
			return {
				data: url,
				message: "url already exists",
				statusCode: HTTPStatus.OK,
			};

		const { data: codeExists } = await supabaseClient
			.from("urls")
			.select("*")
			.eq("code", code)
			.single();

		if (codeExists) throw new ConflictException("code already exists");

		const payload = {
			url: json.url,
			code,
		};

		const { error } = await supabaseClient
			.from("urls")
			.insert([payload])
			.single();

		if (error)
			throw new InternalServerErrorException("internal server error");

		await fetch(DISCORD_WEBHOOK_URL, {
			body: JSON.stringify({
				content: `${json.url} shortened`,
				embeds: [
					{
						fields: [
							{
								name: "Long URL",
								value: json.url,
							},
							{
								name: "Short URL",
								value: `${BASE_URL}/${code}`,
							},
						],
						color: 7506394,
					},
				],
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		return {
			data: payload,
			message: "url created",
			statusCode: HTTPStatus.CREATED,
		};
	}
}
