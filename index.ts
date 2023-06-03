import { Handle } from "sidra";
import { AppController } from "./controllers/app.controller";
import { BookmarkController } from "./controllers/bookmark.controller";
import { ShortenController } from "./controllers/shorten.controller";
import { StorageController } from "./controllers/storage.controller";

export const handler = Handle([
	StorageController,
	ShortenController,
	BookmarkController,
	AppController,
]);
