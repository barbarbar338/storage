import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";

export const File = createParamDecorator(
	async (_data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest() as FastifyRequest;
		const file = req.incomingFile;
		return file;
	},
);
