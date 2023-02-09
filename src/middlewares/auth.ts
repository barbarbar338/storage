import { UnauthorizedException } from "sidra";

export const auth = (req: Request) => {
	const username = req.headers.get("X-Storage-Username");
	const password = req.headers.get("X-Storage-Password");
	if (username != USERNAME || password != PASSWORD)
		throw new UnauthorizedException("invalid username or password");
};
