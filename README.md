# image-upload

**To run:**

Make sure MongoDB is running on localhost and Node.js is installed.

    git clone https://github.com/namansood/image-upload
    cd image-upload
    npm install
    node index.js

**API:**

	POST /images/add
		expects field "photo"
		returns JSON object:
			status: either "ok" or "err"
			id: if status is ok then ID of image
			error: if status is err then error message

	GET /images/:id
		returns photo with requested ID, or 404 if not found