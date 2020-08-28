# image-upload

**To run:**

Make sure MongoDB is running on localhost and Node.js is installed.

    git clone https://github.com/namansood/image-upload
    cd image-upload
    npm install
    node index.js

**API:**

	POST /images/add
		expects field "photos" file photo files
		returns JSON object:
			files: array of objects indicating status of uploaded photo
				filename: original uploaded filename (for reference, not preserved on server)
				status: either "ok" or "err"
				id: if status is ok then ID of image
				error: if status is err then error message

	GET /images/:id
		returns photo with requested ID, or 404 if not found