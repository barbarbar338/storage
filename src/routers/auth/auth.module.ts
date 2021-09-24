import { Module } from "@nestjs/common";
import { AuthController } from "@routers/auth/auth.controller";
import { AuthService } from "@routers/auth/auth.service";

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
