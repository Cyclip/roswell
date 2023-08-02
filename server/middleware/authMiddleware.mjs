import jwt from 'jsonwebtoken';

export function authenticationMiddleware(req, res, next) {
    // Assuming the token is sent in the Authorization header as "Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log("token", token, err);
        return res.status(401).json({ message: 'Authentication failed' });
    }
}