import { NestFactory } from "@nestjs/core";
import helmet from "fastify-helmet";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import * as morgan from "morgan";
import multipart from "fastify-multipart";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "src/app.module";
import CONFIG from "src/config";

global.XMLHttpRequest = require("xhr2");

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	app.register(multipart);
	app.register(helmet);
	app.enableCors();
	app.use(morgan("dev"));
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	app.setGlobalPrefix(CONFIG.API_VERSION);
	await app.listen(CONFIG.PORT, "0.0.0.0");
}
bootstrap();
