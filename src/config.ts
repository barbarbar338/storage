import * as dotenv from "dotenv";
dotenv.config();

const CONFIG = {
	API_VERSION: (process.env.API_VERSION as string) || "v1",
	PORT: parseInt(process.env.PORT),
	SECRET: process.env.SECRET as string,
	STORAGE_USERNAME: process.env.STORAGE_USERNAME as string,
	STORAGE_PASSWORD: process.env.STORAGE_PASSWORD as string,
	SUPABASE: {
		public_url: process.env.SUPABASE_PUBLIC_URL as string,
		public_anon_key: process.env.SUPABASE_PUBLIC_ANON_KEY as string,
	},
	SITE_URL: process.env.SITE_URL as string,
};

export default CONFIG;
