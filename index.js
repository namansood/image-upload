const express = require('express');
const Photo = require('./db');
const multer = require('multer');
const crypto = require('crypto');
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

const viewsDir = __dirname + '/views';

app.get('/', function(req, res) {
	res.sendFile(viewsDir + '/index.html');
});

app.post('/images/add', upload.array('photos'), function(req, res) {
	const response = {
		files: []
	}

	for(var file of req.files) {
		console.log('Received file ' + file.originalname);

		const pic = new Photo;

		const id = crypto.randomBytes(8).toString('hex');

		pic.id = id;
		pic.extn = file.mimetype.split('/')[1];

		fs.renameSync(
			__dirname + '/images/' + file.filename,
			__dirname + '/images/' + pic.filename()
		);

		pic.save();

		response.files.push({
			filename: file.originalname,
			status: 'ok',
			id: id
		});
	}

	if(req.skippedFiles) {
		for(var filename of req.skippedFiles) {
			response.files.push({
				filename: filename,
				status: 'err',
				err: 'badextn'
			});
		}
	}

	res.send(response);
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

		res.sendFile(__dirname + '/images/' + pic.filename(), function(err) {
			if(err) res.sendStatus(404);
		});
	});
});

app.listen(4242, function() {
	console.log('Listening on port 4242');
});
