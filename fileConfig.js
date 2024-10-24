import cloudinary from './cloudinaryConfig.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'movie_db',
        allowed_formats: ['jpg','jpeg','png'],
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024},
});

export default upload;