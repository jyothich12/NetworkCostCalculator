const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('zipFile');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const jsDirectory = path.join(__dirname, 'scripts');

// Serve JavaScript files from the specified directory
app.use('/scripts', express.static(jsDirectory));

// Handle requests for JavaScript files with a wildcard
app.get('/*.js', (req, res) => {
    res.status(404).send('Not Found');
});

// Set the directory where your CSS files are located
const cssDirectory = path.join(__dirname, 'styles');

// Serve CSS files with the correct MIME type
app.use('/styles', express.static(cssDirectory, { 
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    },
}));

// Handle requests for CSS files with a wildcard
app.get('/*.css', (req, res) => {
    res.status(404).send('Not Found');
});

// Set the directory where your images are located
const imagesDirectory = path.join(__dirname, 'images');

// Serve images with the correct MIME type
app.use('/images', express.static(imagesDirectory, {
    setHeaders: (res, path) => {
        // You can add more conditions here based on file extensions if needed
        if (path.endsWith('.jpg')) {
            res.setHeader('Content-Type', 'image/jpeg');
        } else if (path.endsWith('.png')) {
            res.setHeader('Content-Type', 'image/png');
        }
        // Add more conditions as needed for other image types
    },
}));

// Handle requests for images with a wildcard
app.get('/*.jpg', (req, res) => {
    res.status(404).send('Not Found');
});

app.get('/*.png', (req, res) => {
    res.status(404).send('Not Found');
});


app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error uploading file.' });
        } else {
            // Process the uploaded file here
            // Read the file, parse data, and perform required operations

            // For demonstration, sending back dummy zip codes
            const zipCodes = ['62901', '62905', '62910']; // Replace with actual zip codes from the uploaded file
            res.json({ zipCodes });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});