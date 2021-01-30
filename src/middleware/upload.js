const multer = require('multer');
const helpers = require('../helpers/helpers')

const storage = multer.diskStorage({
     destination: (req, file, callback) => {
         callback(null, './upload');
     },
     filename: (req, file, callback) => {
         callback(null, Date.now()+'-'+file.originalname);
     }
 });

 let fileFilter = function (req, file, cb) {
     var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];
     if (allowedMimes.includes(file.mimetype)) {
         cb(null, true);
     } else {
         cb({
             success: false,
             message: 'Invalid file type. Only jpg, png image files are allowed.'
         }, false);
     }
 };
 let obj = {
     storage: storage,
     limits: {
         fileSize: 1 * 1024 * 1024
 },
     fileFilter: fileFilter
 };

 const upload = multer(obj).single('image'); // upload.single('file')
 exports.fileUpload = (req, res,next) => {
     upload(req, res, function (error) {
         if (error) { //instanceof multer.MulterError
             res.status(500);
             if (error.code == 'LIMIT_FILE_SIZE') {
                 return helpers.response(res, null, 500, { message: 'File Size is too large. Allowed file size is 1Mb' })
             }
             return helpers.response(res, null, 500, { message: 'Invalid file type. Only jpg, png image files are allowed.' })
         } else {
             if (!req.file) {
                 res.status(500);
                 res.json('file not found');
             }
             return next()
         }
     })
 };