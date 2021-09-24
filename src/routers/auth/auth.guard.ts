import {
	Injectable,
	CanActivate,
	ExecutionContext,
	BadRequestException,
} from "@nestjs/common";
import * as Jwt from "jsonwebtoken";
import CONFIG from "src/config";
import { AuthService } from "@routers/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}
	public canActivate(ctx: ExecutionContext): boolean {
		const req = ctx.switchToHttp().getRequest();
		const token: string =
			req.headers["authorization"] || req.headers["x-access-token"];
		if (!token) throw new BadRequestException("invalid access token");

		Jwt.verify(token, CONFIG.SECRET, (err, decoded: Storage.User) => {
			if (err) throw new BadRequestException("invalid access token");

			this.authService.authenticate({
				username: decoded.username,
				password: decoded.password,
			});

			req.user = decoded;

			return true;
		});

		return true;
	}
}
