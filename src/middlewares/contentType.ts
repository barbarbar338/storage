import { BadRequestException } from "sidra";

export const contentType = (type: string) => (req: Request) => {
	const mime = req.headers.get("content-type");
	if (!mime || !mime.startsWith(type))
		throw new BadRequestException("unsupported content type");
};
