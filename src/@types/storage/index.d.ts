export {};

declare module "fastify" {
	interface FastifyRequest {
		incomingFile: Storage.MultipartFile;
		isMultipart: () => boolean;
		file: () => Promise<Storage.MultipartFile>;
	}
}

declare global {
	namespace Storage {
		interface APIRes<T> {
			statusCode: import("@nestjs/common").HttpStatus;
			message: string | string[];
			data: T;
			error?: string;
		}

		interface AccessTokenData {
			access_token: string;
			expiresIn: number;
		}

		interface User {
			username: string;
			password: string;
		}

		interface MultipartFile {
			toBuffer: () => Promise<Buffer>;
			file: NodeJS.ReadableStream;
			filepath: string;
			fieldname: string;
			filename: string;
			encoding: string;
			mimetype: string;
			fields: import("fastify-multipart").MultipartFields;
		}
	}
}
