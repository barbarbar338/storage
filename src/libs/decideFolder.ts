export const decideFolder = (mime: string) => {
	if (mime.startsWith("video")) return "videos";
	else if (mime.startsWith("image/gif")) return "gifs";
	else if (mime.startsWith("image")) return "images";
	else return "others";
};
