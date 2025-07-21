import {
	type APIRes,
	Controller,
	Get,
	HTTPStatus,
	type IRedirectRes,
	Middleware,
	Redirect,
} from "sidra";
import { Env } from "../env";
import { auth } from "../middlewares/auth";

export function createAppController(env: Env) {
	@Controller()
	class AppController {
		@Redirect()
		@Get()
		get(): IRedirectRes {
			return {
				statusCode: HTTPStatus.FOUND,
				to: "https://github.com/barbarbar338/storage",
			};
		}

		@Middleware(auth(env))
		@Get("/auth-test")
		auth(): APIRes<string> {
			return {
				data: "auth successfull",
				message: "Hello, world!",
				statusCode: HTTPStatus.OK,
			};
		}
	}

	return AppController;
}
