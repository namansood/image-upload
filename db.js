const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Photo = new Schema({
	id: String,
	extn: String
});

Photo.methods.filename = function() {
	return this.id + '.' + this.extn;
}

mongoose.connect('mongodb://localhost/imageupload', {
	useNewUrlParser: true
});

module.exports = mongoose.model('Photo', Photo);