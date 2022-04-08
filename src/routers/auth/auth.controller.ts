import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "@routers/auth/auth.service";
import { LoginDTO } from "@routers/auth/dto/login.dto";
import { AuthGuard } from "@routers/auth/auth.guard";
import { User } from "@routers/auth/user.decorator";
import CONFIG from "src/config";

@Controller(CONFIG.API_VERSION + "/auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("ping")
	public returnPing(): Storage.APIRes<null> {
		return this.authService.replyPing();
	}

	@Post("login")
	public login(
		@Body() body: LoginDTO,
	): Storage.APIRes<Storage.AccessTokenData> {
		return this.authService.login(body);
	}

	@Get("@me")
	@UseGuards(AuthGuard)
	public getPersonalInfo(
		@User() user: Storage.User,
	): Storage.APIRes<Storage.User> {
		return this.authService.getMe(user);
	}
}
