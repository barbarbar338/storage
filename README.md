# 📦 My personal storage

A system where you can share your files publicly on the internet. Upload your files and share them with anyone with a permanent url!

-   Depends on [Supabase](https://supabase.io/) storage
-   Hosted on [Lagon](https://lagon.app)
-   Chrome extension: [Click!](https://github.com/barbarbar338/storage-chrome-extension)

# 🎁 Example

`https://worker.338.rocks/storage/uploads/images/217324892209676293.png`
![example](https://worker.338.rocks/storage/uploads/images/217324892209676293.png)

# 🎈 Usage

-   Setup your Supabase storage (see instructions below)
-   Setup your Supabase tables (see instructions below)
-   Setup your Lagon function (see instructions below)
-   Clone repo
-   Run `yarn` or `npm i`
-   Run `yarn dev` or `npm run dev` to start development server
-   Run `yarn deploy` or `npm run deploy` to deploy project to Lagon

# ⚡️ Supabase Storage Setup

-   Create a bucket called `uploads`
    ![Create Bucket](https://worker.338.rocks/storage/uploads/images/214474010631733253.png)
    ![Set Name](https://worker.338.rocks/storage/uploads/images/214476763441528847.png)
-   Create 2 new policies as follows
    ![Create Policies](https://worker.338.rocks/storage/uploads/images/214474469236932614.png)
    ![Create From Template](https://worker.338.rocks/storage/uploads/images/214474618927448071.png)
    ![Enable Read Access To Everyone](https://worker.338.rocks/storage/uploads/images/214474787119038472.png)
    ![Click Review](https://worker.338.rocks/storage/uploads/images/214474952768880649.png)
    ![Then Save Policy](https://worker.338.rocks/storage/uploads/images/214475066094780426.png)
    ![Create Another Policy](https://worker.338.rocks/storage/uploads/images/214475499529961483.png)
    ![Update Policy](https://worker.338.rocks/storage/uploads/images/214476197688639500.png)
    ![Then Save Policy](https://worker.338.rocks/storage/uploads/images/214476313275269133.png)
    ![Now You Are Ready To Go](https://worker.338.rocks/storage/uploads/images/214476505919651854.png)

# ⚡️ Supabase Tables Setup

-   Create table called `urls` with these rows:

```
id: int4 @autoincrement
url: varchar
code: varchar
createdAt: timestampz @now
updatedAt: timestampz @now
```

![URLs Table](https://worker.338.rocks/storage/uploads/images/374535316738015232.png)

-   Create table called `bookmarks` with these rows:

```
id: int4 @autoincrement
url: varchar
description: varchar
title: varchar
imageUrl: varchar
createdAt: timestampz @now
updatedAt: timestampz @now
```

![Bookmarks Table](https://worker.338.rocks/storage/uploads/images/374535790522400768.png)

# ⚡️ Lagon Setup

Create these environment variables:

```
BASE_URL=https://example.com
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/id/token
MAX_FILE_SIZE=100000000
PASSWORD=admin
USERNAME=admin
SUPABASE_KEY=YOUR_SUPABASE_KEY
SUPABASE_URL=YOUR_SUPABASE_URL
```

![Variables](https://worker.338.rocks/storage/uploads/images/374533767940931584.png)

## 🧶 Upload file

Here is an example file upload request:

```html
<form id="myForm">
	<input type="file" name="file1" />
	<button type="submit">Submit</button>
</form>
<script>
	const form = document.getElementById("myForm");
	form.addEventListener("submit", (e) => {
		e.preventDefault();

		const formData = new FormData(form);
		fetch("http://localhost:8787/storage/upload", {
			method: "POST",
			body: formData,
			headers: {
				"X-Storage-Username": "YOUR_STORAGE_USERNAME",
				"X-Storage-Password": "YOUR_STORAGE_PASSWORD",
				"Content-Type": "multipart/formdata",
			},
		});
	});
</script>
```

Example response:

```js
{
	"statusCode": 201,
	"message": "file uploaded",
	"data": "http://localhost:8787/storage/uploads/images/374527004130803712.png"
}
```

## 😎 Get file

Send a GET request to `storage/uploads/:folder/:file` endpoint:

```
GET http://localhost:8787/storage/uploads/images/137312178217811969.png
```

## 🔗 Shorten URL

Send a POST request to `shorten` endpoint:

> Also you can add `code` field to body to shorten url with custom code.

```
POST http://localhost:8787/shorten
X-Storage-Username: YOUR_STORAGE_USERNAME
X-Storage-Password: YOUR_STORAGE_PASSWORD
Content-Type: application/json

{
	"url": "https://example.com"
}
```

## 📝 Get shortened URL

Send a GET request to `:code` endpoint:

> This endpoint will redirect you to the original url.

```
GET http://localhost:8787/:code
```

## 📕 Bookmark

Send a POST request to `bookmark` endpoint:

```
POST http://localhost:8787/bookmark
X-Storage-Username: YOUR_STORAGE_USERNAME
X-Storage-Password: YOUR_STORAGE_PASSWORD
Content-Type: application/json

{
	"url": "https://example.com",
	"title": "Example Website",
	"description": "An example website to test things out",
	"imageUrl": "https://via.placeholder.com/150"
}
```

Example response:

```js
{
	"statusCode": 201,
	"message": "bookmark created",
	"data": {
		"url": "https://example.com",
		"title": "Example Website",
		"description": "An example website to test things out",
		"imageUrl": "https://via.placeholder.com/150"
	}
}
```

## 📗 Get Bookmarks

Send a GET request to `bookmark/all` endpoint:

```
GET http://localhost:8787/bookmark/all
```

Example response:

```js
{
	"statusCode": 200,
	"message": "Get all bookmarks",
	"data": [
		{
			"id": 0,
			"url": "https://example.com",
			"title": "Example Website",
			"description": "An example website to test things out",
			"imageUrl": "https://via.placeholder.com/150"
		},
		{
			"id": 1,
			"url": "https://example.com",
			"title": "Example Website",
			"description": "An example website to test things out",
			"imageUrl": "https://via.placeholder.com/150"
		}
	]
}
```

# 🚀 Using with ShareX

You can use the config file I prepared. Just rename `config.sxcu.example` to `config.sxcu` and reconfigure it according to yourself.

# 🤼‍♂️ Contributing

Feel free to use Github's features
