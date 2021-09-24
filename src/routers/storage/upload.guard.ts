import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";

@Injectable()
export class UploadGuard implements CanActivate {
	public async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const req = ctx.switchToHttp().getRequest() as FastifyRequest;

		const isMultipart = req.isMultipart();
		if (!isMultipart)
			throw new BadRequestException("multipart/form-data expected.");

		const file = await req.file();
		if (!file) throw new BadRequestException("file expected");

		req.incomingFile = file;

		return true;
	}
}
