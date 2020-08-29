# image-upload

A simple API for uploading images.

## Features

1. Uploads are anonymous; no login/signup required.
2. Simple deletion process that only lets you upload your own images despite anonymity, using "deletion passwords" supplied at the time of upload.
3. Supports batch upload/delete.

## Build and run

1. Install MongoDB: https://docs.mongodb.com/manual/administration/install-community/. Enable and start the `mongod` service on your operating system.

2. Install Node.js: https://nodejs.org/en/

3. Run the code as:

    git clone https://github.com/namansood/image-upload
    cd image-upload
    npm install
    node index.js

Server will start on localhost:4242, and opening this URL in a browser will show an interactive demo of the API below.

## API documentation

	POST /images/add
		expects field "photos" with photo files (jpg, png, gif)
		returns JSON object:
			files: array of objects indicating status of uploaded photo
				filename: original uploaded filename (for reference, not preserved on server)
				status: either "ok" or "err"
				id: if status is ok then ID of photo
				deletionPassword: if status is ok then password that can be used to delete photo
				error: if status is err then error message

	POST /images/delete
		expects JSON object:
			files: array of objects indicating photos to be deleted
				id: ID of photo
				password: deletion password supplied when photo was uploaded
			NOTE: if files contains an object without an "id" field, it will be ignored in the response
		returns JSON object:
			files: array of objects indicating status of deletion of photos
				id: ID supplied for deletion
				status: either "ok" or "err"
				error: if status is "err" then error message

	GET /images/:id
		returns photo with requested ID, or 404 if not found