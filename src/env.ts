export interface Env {
	// Public variables
	BASE_URL: string;

	// Private variables
	USERNAME: string;
	PASSWORD: string;
	MINIO_CONSOLE_HOST: string;
	MINIO_ACCESS_KEY: string;
	MINIO_SECRET_KEY: string;
	MINIO_BUCKET_NAME: string;
	MINIO_REGION: string;
}
