import { type IRequest } from "itty-router";
import { UnauthorizedException } from "sidra";

export const auth = (req: IRequest) => {
	const username = req.headers.get("X-Storage-Username");
	const password = req.headers.get("X-Storage-Password");
	if (username != process.env.USERNAME || password != process.env.PASSWORD)
		throw new UnauthorizedException("invalid username or password");
};
