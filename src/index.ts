import { AwsClient } from "aws4fetch";
import { Handle } from "sidra";
import { createAppController } from "./controllers/app.controller";
import { createStorageController } from "./controllers/storage.controller";
import { Env } from "./env";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		console.log(JSON.stringify(env, null, 2));

		const aws = new AwsClient({
			accessKeyId: env.MINIO_ACCESS_KEY,
			secretAccessKey: env.MINIO_SECRET_KEY,
			region: env.MINIO_REGION,
			service: "s3",
		});

		const handler = Handle(
			// TODO: this is a very bad code, fix sidra!
			[createStorageController(env, aws), createAppController(env)],
			{
				allowedHeaders: "Content-Type, Authorization",
				methods: "GET, POST, OPTIONS",
				origin: "*",
				maxAge: 86400,
			},
		);

		return handler(request);
	},
};
