import jwt from 'jsonwebtoken';

const access_token_secret = process.env.ACCESS_TOKEN_SECRET;

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(400).json({ message: 'Token not present' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token not present' });
    }

    jwt.verify(token, access_token_secret, (err, user) => {
        if (err) {
            res.statusCode = 403;
            return res.status(403).json({ message: 'Invalid Token' });
        }

        req.user = user;

        next();
    });
};

export default { validateToken }
