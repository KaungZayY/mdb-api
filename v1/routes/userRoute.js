import express from 'express';
import userController from '../controllers/userController.js';
import upload from '../../configs/fileConfig.js';

const router = express.Router();

/* API Route: /api/v1/users/upload-image
** Method: POST
** params: form-data:image as key image
** Return: file.path */
router.post('/upload-profile', upload.single('image'), async (req, res) => {
    await userController.uploadImage(req, res);
});

/* API Route: /api/v1/users
** Method: POST
** params: name, profileImageUrl, email, password, phonenumber(optional) */
router.post('/', async (req, res) => {
    await userController.createUser(req, res);
});

/* API Route: /api/v1/users/login
** Method: POST
** params: name, profileImageUrl, email, password, phonenumber(optional) */
router.post('/login', async (req, res) => {
    await userController.userLogin(req, res);
});

/* API Route: /api/v1/users/refresh
** Method: POST
** params: token */
router.post('/refresh', async (req, res) => {
    await userController.tokenRefresh(req, res);
});

/* API Route: /api/v1/users/logout
** Method: DELETE
** params: token */
router.delete('/logout', async (req, res) => {
    await userController.userLogout(req, res);
});

export default router;