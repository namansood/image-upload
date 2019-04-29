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
			req.incorrectFileType = true;
			return callback(null, false, new Error('Please upload a valid image!'));
		}
		callback(null, true);
	}
});
const app = express();



app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.post('/images/add', upload.single('photo'), function(req, res) {
	if(req.file) {
		console.log('Received file ' + req.file.originalname);

		const pic = new Photo;

		const id = crypto.randomBytes(8).toString('hex');

		pic.id = id;
		pic.extn = req.file.mimetype.split('/')[1];

		fs.renameSync(
			__dirname + '/images/' + req.file.filename,
			__dirname + '/images/' + pic.filename()
		);

		pic.save();

		res.send({
			status: 'ok',
			id: id
		});
	}

	else {
		res.send({
			status: 'err',
			error: req.incorrectFileType ? 'wrongfile' : 'nofile'
		});
	}
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
