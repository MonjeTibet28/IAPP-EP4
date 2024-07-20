import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import config from '../config';

dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado' });
    }

    jwt.verify(token, config.jwt_key, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

export default verifyToken;
