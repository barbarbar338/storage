import { type Request } from "itty-router";
import {
	Controller,
	Get,
	HTTPStatus,
	IRedirectRes, Middleware, NotFoundException,
	Redirect, type APIRes
} from "sidra";
import { supabaseClient } from "../libs/supabase";
import { auth } from "../middlewares/auth";

@Controller()
export class AppController {
	@Get()
	get(): APIRes<string> {
		return {
			data: "app",
			message: "Hello, world!",
			statusCode: HTTPStatus.OK,
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
	async getCode(req: Request): Promise<IRedirectRes> {
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
