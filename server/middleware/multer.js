const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024,files: 3}, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPG and PNG images are allowed!'), false);
        }
        cb(null, true);
    }
});
module.exports = upload;        