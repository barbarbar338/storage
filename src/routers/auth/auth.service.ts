import { Injectable, HttpStatus, UnauthorizedException } from "@nestjs/common";
import * as Jwt from "jsonwebtoken";
import { LoginDTO } from "@routers/auth/dto/login.dto";
import CONFIG from "src/config";

@Injectable()
export class AuthService {
	public replyPing(): Storage.APIRes<null> {
		return {
			statusCode: HttpStatus.OK,
			message: "Pong!",
			data: null,
		};
	}

	public login({
		username,
		password,
	}: LoginDTO): Storage.APIRes<Storage.AccessTokenData> {
		const { access_token, expiresIn } = this.getToken({
			password,
			username,
		});

		return {
			statusCode: HttpStatus.OK,
			message: "Successfully logged in",
			data: {
				access_token,
				expiresIn,
			},
		};
	}

	private generateToken(
		payload: Storage.User,
		expiresIn: number = 30 * 24 * 60 * 60 * 1000,
	): { access_token: string; expiresIn: number } {
		const access_token = Jwt.sign(payload, CONFIG.SECRET, {
			algorithm: "HS512",
			expiresIn,
		});

		return {
			access_token,
			expiresIn,
		};
	}

	public authenticate({ username, password }: LoginDTO): boolean {
		if (username != CONFIG.STORAGE_USERNAME)
			throw new UnauthorizedException("Invalid username");

		if (password != CONFIG.STORAGE_PASSWORD)
			throw new UnauthorizedException("Invalid password");

		return true;
	}

	public getToken({ username, password }: LoginDTO): Storage.AccessTokenData {
		this.authenticate({ username, password });

		const { access_token, expiresIn } = this.generateToken({
			password,
			username,
		});

		return { access_token, expiresIn };
	}

	public getMe(user: Storage.User): Storage.APIRes<Storage.User> {
		this.authenticate(user);

		return {
			statusCode: HttpStatus.OK,
			message: "get me",
			data: user,
		};
	}
}
