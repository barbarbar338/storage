import {
	BadRequestException,
	Controller,
	Get,
	HTTPStatus,
	InternalServerErrorException,
	Middleware,
	Post,
	type APIRes,
} from "sidra";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";
import { contentType } from "../middlewares/contentType";

@Controller("/bookmark")
export class BookmarkController {
	@Get()
	get(): APIRes<string> {
		return {
			data: "bookmark",
			message: "Hello, world!",
			statusCode: HTTPStatus.OK,
		};
	}

	@Get("all")
	async getAll(): Promise<APIRes<unknown>> {
		console.log("req");
		const { data: bookmarks, error } = await supabaseClient
			.from("bookmarks")
			.select("*");

		if (error)
			throw new InternalServerErrorException("internal server error");

		return {
			data: bookmarks,
			message: "Get all bookmarks",
			statusCode: HTTPStatus.OK,
		};
	}

	@Middleware(auth, contentType("application/json"))
	@Post()
	async post(req: Request): Promise<APIRes<unknown>> {
		const json = await req.json<{
			url: string;
			title: string;
			description: string;
			imageUrl: string;
		}>();

		if (!json.url || !json.imageUrl || !json.title || !json.description)
			throw new BadRequestException("invalid request body");

		const { data: bookmark } = await supabaseClient
			.from("bookmarks")
			.select("*")
			.eq("url", json.url)
			.single();

		if (bookmark)
			return {
				data: bookmark,
				message: "bookmark already exists",
				statusCode: HTTPStatus.OK,
			};

		const payload = {
			url: json.url,
			title: json.title,
			description: json.description,
			imageUrl: json.imageUrl,
		};

		const { error } = await supabaseClient
			.from("bookmarks")
			.insert([payload])
			.single();

		if (error)
			throw new InternalServerErrorException("internal server error");

		await fetch(DISCORD_WEBHOOK_URL, {
			body: JSON.stringify({
				content: `${json.url} bookmarked`,
				embeds: [
					{
						author: {
							name: json.title,
							icon_url: json.imageUrl,
						},
						description: json.description,
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
			message: "bookmark created",
			statusCode: HTTPStatus.CREATED,
		};
	}
}
