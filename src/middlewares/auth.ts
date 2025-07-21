import { type IRequest } from "itty-router";
import { UnauthorizedException } from "sidra";
import { Env } from "../env";

export const auth = (env: Env) => (req: IRequest) => {
	const username = req.headers.get("X-Storage-Username");
	const password = req.headers.get("X-Storage-Password");
	if (username != env.USERNAME || password != env.PASSWORD)
		throw new UnauthorizedException("invalid username or password");
};
