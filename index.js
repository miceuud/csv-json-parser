const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');
const PORT = 5000;

// initialise server
const app = express();

app.post('/upload', (req, res) => {
	const upload = multer({ dest: 'uploads/' }).single('data');

	//   get loaded file
	upload(req, res, function (err) {
		let data = req.file;

		// check uploaded file type
		if (!data.mimetype.split('/').includes('csv'))
			res.status(400).json({
				message: 'please upload a valid csv file',
				status: false,
			});

		// read and parse to JSON
		fs.readFile(path.join(__dirname, '/', data.path), 'utf8', (err, data) => {
			if (err) {
				console.log(err);
				res.status(500).json({
					message: 'something went wrong ',
					status: false,
				});
			}
			const records = parse(data, { columns: true });
			//         generate a random key
			const conversion_key = crypto.randomBytes(20).toString('hex');

			res.status(200).json({
				conversion_key,
				json: records,
			});
		});
	});
});

// listen for requests :)
app.listen(PORT, () => {
   console.log(`Your app is listening on port ${PORT}) 
  });
