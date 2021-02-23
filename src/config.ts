import * as dotenv from "dotenv";
dotenv.config();

const CONFIG = {
	API_VERSION: (process.env.API_VERSION as string) || "v1",
	PORT: parseInt(process.env.PORT),
	SECRET: process.env.SECRET as string,
	STORAGE_USERNAME: process.env.STORAGE_USERNAME as string,
	STORAGE_PASSWORD: process.env.STORAGE_PASSWORD as string,
	FIREBASE: {
		apiKey: process.env.FIREBASE_API_KEY as string,
		authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
		projectId: process.env.FIREBASE_PROJECT_ID as string,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
		appId: process.env.FIREBASE_APP_ID as string,
		measurementId: process.env.FIREBASE_MEASUREMENT_ID as string,
	},
	SITE_URL: process.env.SITE_URL as string,
};

export default CONFIG;
