const express = require('express');
const Photo = require('./db');
const multer = require('multer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs');

const storage = multer.diskStorage({
	destination: './images'
});

const upload = multer({
	storage: storage,
	fileFilter: function(req, file, callback) {
		const supportedFiletypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
		if(supportedFiletypes.indexOf(file.mimetype) < 0) {
			if(!req.skippedFiles) {
				req.skippedFiles = [ file.originalname ];
			}
			else {
				req.skippedFiles.push(file.originalname);
			}
			return callback(null, false);
		}
		callback(null, true);
	}
});

const app = express();

const imageDir = __dirname + '/images';
const saltRounds = 10;

app.use(express.static(__dirname + '/static'));

app.post('/images/add', upload.array('photos'), async function(req, res) {
	const response = {
		files: []
	}

	for(let file of req.files) {
		console.log('Received file ' + file.originalname);

		const pic = new Photo;

		const id = crypto.randomBytes(8).toString('hex');
		const deletionPassword = crypto.randomBytes(32).toString('hex');

		pic.id = id;
		pic.extn = file.mimetype.split('/')[1];
		pic.deletionPassword = await bcrypt.hash(deletionPassword, saltRounds);

		fs.renameSync(
			imageDir + '/' + file.filename,
			imageDir + '/' + pic.filename()
		);

		pic.save();

		response.files.push({
			filename: file.originalname,
			status: 'ok',
			id: id,
			deletionPassword: deletionPassword
		});
	}

	if(req.skippedFiles) {
		for(let filename of req.skippedFiles) {
			response.files.push({
				filename: filename,
				status: 'err',
				err: 'badextn'
			});
		}
	}

	res.send(response);
});

app.post('/images/delete', bodyParser.json(), function(req, res) {
	if(!req.body.files) {
		res.status(400).send({
			status: 'err',
			error: 'noinput'
		});
	}

	const response = {
		files: []
	};

	const promises = [];

	console.log(req.body);

	for(let idx in req.body.files) {
		let { id, password } = req.body.files[idx];

		if(!id) {
			return;
		}

		if(!password) {
			response.files.push({
				id: id,
				status: 'err',
				error: 'nopasswd'
			});
			return;
		}

		const prm = Photo.findOne({ id: id })
		.then(photo => {
			if(!photo) {
				response.files.push({
					id: id,
					status: 'err',
					error: 'badid'
				});
				return;
			}

			return bcrypt.compare(password, photo.deletionPassword)
			.then(valid => {
				if(!valid) {
					response.files.push({
						id: id,
						status: 'err',
						error: 'badpasswd'
					});
					return;
				}
				
				const filename = photo.filename();
				return photo.remove()
				.then(() => {
					fs.unlinkSync(imageDir + '/' + filename);
					response.files.push({
						id: id,
						status: 'ok'
					});
					return;
				});
			});
		})
		.catch(err => {
			response.files.push({
				id: id,
				status: 'err',
				error: 'fail'
			});
			return null;
		});

		promises.push(prm);
	}

	console.log(promises.length + ' promises');

	Promise.all(promises)
	.then(() => {
		console.log(response);
		res.send(response);
	});
});

app.get('/images/:id', function(req, res) {
	Photo.findOne({
		id: req.params.id
	}, function(err, pic) {
		if(err) {
			console.log(err);
			res.sendStatus(500);
			return;
		}

		if(!pic) {
			res.sendStatus(404);
			return;
		}

		res.sendFile(imageDir + '/' + pic.filename(), function(err) {
			if(err) res.sendStatus(404);
		});
	});
});

app.listen(4242, function() {
	console.log('Listening on port 4242');
});
