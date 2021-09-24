import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
	(_data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		return req.user;
	},
);
