# 📦 My personal storage

A system where you can share your files publicly on the internet. Upload your files and share them with anyone with a permanent url!

-   Depends on [Supabase](https://supabase.io/) storage
-   Hosted on [Fly](https://fly.io/)
-   Chrome extension: [Click!](https://github.com/barbarbar338/storage-chrome-extension)

# 🎁 Example

`https://storage.fly.dev/v1/storage/uploads/images/217324892209676293.png`
![example](https://storage.fly.dev/v1/storage/uploads/images/217324892209676293.png)

# 🎈 Usage

-   Setup your Supabase storage (see instructions below)
-   Clone repo
-   Run `yarn` or `npm i`
-   Rename `.env.example` file as `.env` and fill required blanks
-   Run `yarn build` or `npm run build`
-   Run `yarn start` or `npm run start`

# ⚡️ Supabase Storage Setup

-   Create a bucket called `uploads`
    ![Create Bucket](https://storage.fly.dev/v1/storage/uploads/images/214474010631733253.png)
    ![Set Name](https://storage.fly.dev/v1/storage/uploads/images/214476763441528847.png)
-   Create 2 new policies as follows
    ![Create Policies](https://storage.fly.dev/v1/storage/uploads/images/214474469236932614.png)
    ![Create From Template](https://storage.fly.dev/v1/storage/uploads/images/214474618927448071.png)
    ![Enable Read Access To Everyone](https://storage.fly.dev/v1/storage/uploads/images/214474787119038472.png)
    ![Click Review](https://storage.fly.dev/v1/storage/uploads/images/214474952768880649.png)
    ![Then Save Policy](https://storage.fly.dev/v1/storage/uploads/images/214475066094780426.png)
    ![Create Another Policy](https://storage.fly.dev/v1/storage/uploads/images/214475499529961483.png)
    ![Update Policy](https://storage.fly.dev/v1/storage/uploads/images/214476197688639500.png)
    ![Then Save Policy](https://storage.fly.dev/v1/storage/uploads/images/214476313275269133.png)
    ![Now You Are Ready To Go](https://storage.fly.dev/v1/storage/uploads/images/214476505919651854.png)

# 🔑 How to get a secret token

Send a POST request to `/auth/login` endpoint:

```
POST https://localhost:3000/v1/auth/login
Content-Type: application/json

{
    "username": "STORAGE_USERNAME",
    "password": "STORAGE_PASSWORD"
}
```

Example response:

```js
{
    statusCode: 200,
    message: "Successfully logged in",
    data: {
        access_token: "YOUR_SECRET_TOKEN",
        expiresIn: 2592000000
    },
}
```

# 🧶 Upload file

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
		fetch("http://localhost:3000/v1/storage/upload", {
			method: "POST",
			body: formData,
			headers: {
				Authorization: "YOUR_SECRET_TOKEN", // see "How to get secret token"
				"Content-Type": "multipart/formdata",
			},
		});
	});
</script>
```

Example response:

```js
{
    statusCode: 201,
    message: "File uploaded",
    data: "http://localhost:3000/v1/storage/uploads/images/137312178217811969.png",
};
```

# 😎 Get file

Send a GET request to `storage/uploads/:folder/:file` endpoint:

```
GET http://localhost:3000/v1/storage/uploads/images/137312178217811969.png
```

# 🚀 Using with ShareX

You can use the config file I prepared. Just rename `config.sxcu.example` to `config.sxcu` and reconfigure it according to yourself.

# 🤼‍♂️ Contributing

Feel free to use Github's features

# 📄 TODO

-   ❌ Upload files to Telegram
-   ❌ Send shortened links to Discord / Telegram
-   ❌ Send bookmark data to Discord / Telegram
