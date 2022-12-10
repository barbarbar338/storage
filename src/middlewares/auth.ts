import { status } from "itty-router-extras";

export const auth = (req: Request) => {
	const username = req.headers.get("X-Storage-Username");
	const password = req.headers.get("X-Storage-Password");
	if (username != USERNAME || password != PASSWORD)
		return status(401, "unauthorized");
};
