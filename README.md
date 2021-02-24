# 📦 My personal storage
- Depends on firebase storage

# 🎈 Usage
- Clone repo
- Run `yarn` or `npm i`
- Rename `.env.example` file as `.env` and fill required blanks
- Run `yarn build` or `npm run build`
- Run `yarn start` or `npm run start` 

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
    <input type="file" name="file1">
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
                "Authorization": "YOUR_SECRET_TOKEN", // see "How to get secret token"
                "Content-Type": "multipart/formdata
            }
        });
    });
</script>
```

Example response: 
```js
{
    statusCode: 201,
    message: "File uploaded",
    data: "http://localhost:3000/v1/storage/uploads/137312178217811969.png",
};
```

# 😎 Get file
Send a GET request to `storage/uploads/:file` endpoint:
```
GET http://localhost:3000/v1/storage/uploads/137312178217811969.png
```

# 🤼‍♂️ Contributing
Feel free to use Github's features
