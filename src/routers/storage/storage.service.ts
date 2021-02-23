import { Injectable, HttpStatus } from "@nestjs/common";
import firebase from "firebase";
import CONFIG from "src/config";
import { Snowflake } from "@snowflake";
import got from "got";
import * as mime from "mime-types";
import "@firebase/storage";

@Injectable()
export class StorageService {
	constructor(private readonly snowflake: Snowflake) {}

	private readonly Firebase = firebase.initializeApp(CONFIG.FIREBASE);
	private readonly FirebaseStorage = this.Firebase.storage();
	private readonly FirebaseRef = this.FirebaseStorage.ref();

	public returnPing(): Storage.APIRes<null> {
		return {
			statusCode: HttpStatus.OK,
			message: "Pong!",
			data: null,
		};
	}

	public async uploadFile(
		file: Storage.MultipartFile,
	): Promise<Storage.APIRes<unknown>> {
		const buffer = await file.toBuffer();
		const fileName = file.filename;
		const extension = fileName.split(".").pop();
		const id = this.snowflake.generate();
		const path = `uploads/${id}.${extension}`;
		const uploadRef = this.FirebaseRef.child(path);
		await uploadRef.put(buffer, {
			contentType: mime.lookup(extension) || "applicaton/octet-stream",
		});
		return {
			statusCode: HttpStatus.CREATED,
			message: "File uploaded",
			data: `${CONFIG.SITE_URL}/${CONFIG.API_VERSION}/storage/${path}`,
		};
	}

	public async getFile(filePath: string): Promise<Buffer> {
		const path = `uploads/${filePath}`;
		const uploadRef = this.FirebaseRef.child(path);
		const url = await uploadRef.getDownloadURL();
		const buffer = (await got(url)).rawBody;
		return buffer;
	}
}
