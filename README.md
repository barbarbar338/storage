# 📦 My personal storage
- Depends on firebase storage

# 🎈 Usage
- Clone repo
- Run `yarn` or `npm i`
- Rename `.env.example` file as `.env` and fill required blanks
- Run `yarn build` or `npm run build`
- Run `yarn start` or `npm run start` 

# 🧶 Upload file
Here is an example file upload request:
```html
<form action="http://localhost:3000/v1/storage/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file1">
    <button type="submit">Submit</button>
</form>
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
Send a get request to this endpoint with file id
`http://localhost:3000/v1/storage/uploads/137312178217811969.png`

# 🤼‍♂️ Contributing
Feel free to use Github's features
