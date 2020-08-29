# image-upload

**To run:**

Make sure MongoDB is running on localhost and Node.js is installed.

    git clone https://github.com/namansood/image-upload
    cd image-upload
    npm install
    node index.js

**API:**

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