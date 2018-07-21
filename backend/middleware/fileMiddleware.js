const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const serverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        let error = "Invalid mimetype.";
        if (ext) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({ storage: serverStorage }).single("image");