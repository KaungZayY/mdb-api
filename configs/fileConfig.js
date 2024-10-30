import cloudinary from './cloudinaryConfig.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req) => {
        let folder = 'movie_db';

        if (req.originalUrl.includes('/users/upload-profile')) {
            folder = 'movie_db/user_profiles';
        } else if (req.originalUrl.includes('/movies/upload-image')) {
            folder = 'movie_db/movie_covers';
        }

        return {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png'],
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 10 * 1024 * 1024},
});

export default upload;