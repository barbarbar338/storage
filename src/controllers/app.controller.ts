import { type IRequest } from "itty-router";
import {
	Controller,
	Get,
	HTTPStatus,
	Middleware,
	NotFoundException,
	Redirect,
	type APIRes,
	type IRedirectRes,
} from "sidra";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";

@Controller()
export class AppController {
	@Redirect()
	@Get("/:code")
	get(): IRedirectRes {
		return {
			statusCode: HTTPStatus.FOUND,
			to: "https://github.com/barbarbar338/storage",
		};
	}

	@Middleware(auth)
	@Get("/auth-test")
	auth(): APIRes<string> {
		return {
			data: "auth successfull",
			message: "Hello, world!",
			statusCode: HTTPStatus.OK,
		};
	}

	@Redirect()
	@Get("/:code")
	async getCode(req: IRequest): Promise<IRedirectRes> {
		const code = req.params?.code as string;

		const { data: codeExists } = await supabaseClient
			.from("urls")
			.select("*")
			.eq("code", code)
			.single();
		if (!codeExists) throw new NotFoundException("code not found");

		return {
			statusCode: HTTPStatus.FOUND,
			to: codeExists.url,
		};
	}
}
