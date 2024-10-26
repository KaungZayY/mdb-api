import { User } from '../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;

let refreshTokens = [];

async function uploadImage(req, res){
    try {
        if (!req.file) {
            return res.status(400).send({
                message: `No file uploaded, upload as form-data and key as 'image'`
            });
        }

        const file = req.file;

        return res.status(201).send({
            message: 'File uploaded successfully!',
            imageUrl: file.path
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function createUser(req, res) {
    try {
        if (
            !req.body.name ||
            !req.body.profileImageUrl ||
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).send({
                message: 'Required fields: name, profileImageUrl, email, password'
            });
        }
        
        const emailExists = await User.find({ email: req.body.email });
        if (emailExists.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = {
            name: req.body.name,
            profileImageUrl: req.body.profileImageUrl,
            email: req.body.email,
            password: hashedPassword,
            phonenumber: req.body.phonenumber
        }

        const user = await User.create(newUser);
        return res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function userLogin(req, res){
    try {
        if (
            !req.body.email ||
            !req.body.password
        ) {
            return res.status(400).send({ message: 'Required fields: email, password' });
        }

        const user = await User.findOne({ email:req.body.email });
        if (!user){
            return res.status(404).send({ message: 'User not found' });
        }

        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken({user})
            const refreshToken = generateRefreshToken({user})
            refreshTokens.push(refreshToken);
            return res.status(200).send({
                AccessToken: accessToken,
                RefreshToken: refreshToken
            });
        } 
        else {
            return res.status(401).send({ message: 'User not found' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function userLogout(req, res){
    try {
        if (!req.body.token) {
            return res.status(400).send({ message: 'Refresh token is required' });
        }

        const token = req.body.token;

        if (!token || !refreshTokens.includes(token)) {
            return res.status(400).send({ message: 'Invalid or missing Refresh Token' });
        }

        refreshTokens = refreshTokens.filter((c) => c !== token);
        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

async function tokenRefresh(req, res){
    try {
        if (!req.body.token) {
            return res.status(400).send({ message: 'Refresh token is required' });
        }
        
        const token = req.body.token;
        
        if(!refreshTokens.includes(token)){
            return res.status(400).send({ message: 'Invalid token' });
        }
        const user = jwt.verify(token, refresh_token_secret);
        refreshTokens = refreshTokens.filter( (c) => c != token)
        const accessToken = generateAccessToken({user})
        const refreshToken = generateRefreshToken({user})
        refreshTokens.push(refreshToken);
        return res.status(200).send({
            AccessToken: accessToken,
            RefreshToken: refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
}

function generateAccessToken({user}){
    return jwt.sign({userId:user.id}, access_token_secret, {expiresIn: '20m'});
}

function generateRefreshToken({user}) {
    return jwt.sign({userId:user.id}, refresh_token_secret, {expiresIn: '30m'});
}

export default { uploadImage, createUser, userLogin, tokenRefresh, userLogout };