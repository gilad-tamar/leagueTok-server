const multer = require('multer');

const fileFilter = (req, file, cb) => {
    console.log(cb, file)
    if (file.mimetype === 'video/gif' ||
        file.mimetype === 'video/mp4' ||
        file.mimetype === 'video/ogg' ||
        file.mimetype === 'video/wmv' ||
        file.mimetype === 'video/x-flv' ||
        file.mimetype === 'video/avi') {
        cb(null, true);
    }
    cb(null, false)
}

const storageVideos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const uploadVideo = multer({
    storage: storageVideos,
    limits: {
        fileSize: 1024 * 1024 * 1024 
    },
    fileFilter
});

//Exports
module.exports = {
    uploadVideo: uploadVideo
}