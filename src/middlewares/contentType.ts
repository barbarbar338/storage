import { type IRequest } from "itty-router";
import { BadRequestException } from "sidra";

export const contentType = (type: string) => (req: IRequest) => {
	const mime = req.headers.get("content-type");
	if (!mime || !mime.startsWith(type))
		throw new BadRequestException("unsupported content type");
};
