import { UnauthorizedException } from "sidra";
import { type IRequest } from "itty-router";

export const auth = (req: IRequest) => {
	const username = req.headers.get("X-Storage-Username");
	const password = req.headers.get("X-Storage-Password");
	if (username != USERNAME || password != PASSWORD)
		throw new UnauthorizedException("invalid username or password");
};
