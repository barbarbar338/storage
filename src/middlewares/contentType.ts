import { status } from "itty-router-extras";

export const contentType = (type: string) => (req: Request) => {
	const mime = req.headers.get("content-type");
	if (!mime || !mime.startsWith(type))
		return status(400, "invalid content type");
};
